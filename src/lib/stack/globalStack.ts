import {
  CorsHttpMethod,
  HttpApi,
  HttpApiAttributes
} from '@aws-cdk/aws-apigatewayv2'
import {
  Certificate,
  CertificateValidation
} from '@aws-cdk/aws-certificatemanager'
import {
  ARecord,
  HostedZone,
  HostedZoneAttributes,
  RecordTarget
} from '@aws-cdk/aws-route53'
import {
  CfnOutput,
  Construct,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from '@aws-cdk/core'
import {
  CloudFrontWebDistribution,
  CloudFrontWebDistributionAttributes,
  SSLMethod,
  SecurityPolicyProtocol,
  ViewerCertificate,
  CloudFrontAllowedMethods,
  OriginAccessIdentity
} from '@aws-cdk/aws-cloudfront'
import { Bucket, HttpMethods, BlockPublicAccess } from '@aws-cdk/aws-s3'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib'

export interface GlobalInfo {
  bucketArn: string
  apiAttributes: HttpApiAttributes
  distributionAttributes: CloudFrontWebDistributionAttributes
  certificateArn: string
  zoneAttributes: HostedZoneAttributes
}

export class GlobalStack extends Stack {
  public readonly globalInfo: GlobalInfo

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // URLS
    const siteUrl = 'manualfor.me'
    const protoUrl = `https://${siteUrl}`
    new CfnOutput(this, 'Url', { value: protoUrl })

    // DNS
    const zone = new HostedZone(this, 'HostedZone', {
      zoneName: siteUrl
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: `*.${siteUrl}`,
      subjectAlternativeNames: [siteUrl],
      validation: CertificateValidation.fromDns(zone)
    })
    new CfnOutput(this, 'CertificateArn', { value: certificate.certificateArn })

    // API
    const api = new HttpApi(this, 'widgets-api', {
      apiName: 'Widget Service',
      description: 'This service serves widgets.',
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.HEAD,
          CorsHttpMethod.OPTIONS,
          CorsHttpMethod.POST
        ],
        allowOrigins: ['https://manualfor.me', 'http://localhost:5000'],
        allowCredentials: true,
        maxAge: Duration.seconds(0)
      },
      createDefaultStage: false
    })

    // Bucket
    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: 'manualforme-frontend',
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [HttpMethods.GET],
          maxAge: 3000
        }
      ]
    })
    new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName })

    // CloudFront
    const oai = new OriginAccessIdentity(this, 'CloudFrontOAI')
    siteBucket.grantRead(oai)
    const distribution = new CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: `${api.httpApiId}.execute-api.${this.region}.amazonaws.com`
            },
            behaviors: [
              {
                isDefaultBehavior: false,
                pathPattern: '/api*',
                allowedMethods: CloudFrontAllowedMethods.ALL,
                defaultTtl: Duration.seconds(0),
                forwardedValues: {
                  queryString: true,
                  headers: ['Authorization']
                }
              }
            ]
          },
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: oai
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
                defaultTtl: Duration.seconds(0),
                allowedMethods: CloudFrontAllowedMethods.GET_HEAD_OPTIONS
              }
            ]
          }
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
          sslMethod: SSLMethod.SNI,
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2019,
          aliases: [siteUrl]
        }),
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html'
          }
        ]
      }
    )
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    })

    new ARecord(this, 'SiteAliasRecord', {
      recordName: siteUrl,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone
    })

    this.globalInfo = {
      bucketArn: siteBucket.bucketArn,
      apiAttributes: {
        httpApiId: api.apiId
      },
      distributionAttributes: {
        domainName: distribution.distributionDomainName,
        distributionId: distribution.distributionId
      },
      certificateArn: certificate.certificateArn,
      zoneAttributes: {
        hostedZoneId: zone.hostedZoneId,
        zoneName: zone.zoneName
      }
    }
  }
}
