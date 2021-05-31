import {
  CorsHttpMethod,
  HttpApi,
  HttpApiAttributes
} from '@aws-cdk/aws-apigatewayv2'
import {
  Certificate,
  CertificateValidation
} from '@aws-cdk/aws-certificatemanager'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
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
import {
  CloudFrontTarget,
  UserPoolDomainTarget
} from '@aws-cdk/aws-route53-targets/lib'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { UserPool } from '@aws-cdk/aws-cognito'

export class GlobalStack extends Stack {
  public readonly bucketArn: string
  public readonly apiAttributes: HttpApiAttributes
  public readonly distributionAttributes: CloudFrontWebDistributionAttributes
  public readonly userPoolId: string

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

    // const healthFn = new NodejsFunction(this, 'HealthFn', {
    //   entry: `src/resources/health.ts`
    // })
    // api.addRoutes({
    //   path: '/health',
    //   methods: [HttpMethod.GET],
    //   integration: new LambdaProxyIntegration({
    //     handler: healthFn
    //   })
    // })

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

    const siteARecord = new ARecord(this, 'SiteAliasRecord', {
      recordName: siteUrl,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone
    })

    const preSignUp = new NodejsFunction(this, 'PreSignUpFn', {
      entry: `src/resources/auth/preSignUp.ts`
    })

    const userPool = new UserPool(this, 'pool', {
      userPoolName: 'manualforme-userpool',
      selfSignUpEnabled: true,
      enableSmsRole: false,
      standardAttributes: {
        fullname: {
          mutable: true,
          required: true
        },
        email: {
          mutable: true,
          required: true
        }
      },
      passwordPolicy: {
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false
      },
      signInCaseSensitive: false,
      removalPolicy: RemovalPolicy.DESTROY,
      lambdaTriggers: { preSignUp }
    })

    const authPrefix = 'credentials'
    const authUrl = `${authPrefix}.${siteUrl}`

    const domain = userPool.addDomain('PoolDomain', {
      customDomain: {
        domainName: authUrl,
        certificate
      }
    })
    // Apex record must exist before creating custom cognito domain
    domain.node.addDependency(siteARecord)

    new ARecord(this, 'ARecord_auth', {
      zone: zone,
      recordName: authUrl,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(domain))
    })

    this.bucketArn = siteBucket.bucketArn
    this.apiAttributes = {
      httpApiId: api.apiId
    }
    this.userPoolId = userPool.userPoolId
    this.distributionAttributes = {
      domainName: distribution.distributionDomainName,
      distributionId: distribution.distributionId
    }
  }
}
