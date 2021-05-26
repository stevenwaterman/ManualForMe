import {
  EndpointType,
  RestApi,
  RestApiAttributes,
  SecurityPolicy
} from '@aws-cdk/aws-apigateway'
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
  RemovalPolicy,
  Stack,
  StackProps
} from '@aws-cdk/core'
import {
  CloudFrontWebDistribution,
  CloudFrontWebDistributionAttributes,
  SSLMethod,
  SecurityPolicyProtocol,
  OriginProtocolPolicy,
  ViewerCertificate
} from '@aws-cdk/aws-cloudfront'
import { Bucket } from '@aws-cdk/aws-s3'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib'

export class GlobalStack extends Stack {
  public readonly bucketArn: string
  public readonly certificateArn: string
  public readonly zoneAttributes: HostedZoneAttributes
  public readonly apiAttributes: RestApiAttributes
  public readonly distributionAttributes: CloudFrontWebDistributionAttributes

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // URLS
    const siteUrl = 'manualfor.me'
    const protoUrl = `https://${siteUrl}`
    const apiUrl = `${siteUrl}/api`
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
    const api = new RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.',
      domainName: {
        domainName: apiUrl,
        certificate: certificate,
        securityPolicy: SecurityPolicy.TLS_1_2
      },
      endpointConfiguration: {
        types: [EndpointType.REGIONAL]
      }
    })

    // Bucket
    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: 'ManualForMe-Frontend',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY
    })
    new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName })

    // CloudFront
    const distribution = new CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ],
        viewerCertificate: ViewerCertificate.fromAcmCertificate(certificate, {
          sslMethod: SSLMethod.SNI,
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2018
        })
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

    this.zoneAttributes = {
      hostedZoneId: zone.hostedZoneId,
      zoneName: zone.zoneName
    }
    this.bucketArn = siteBucket.bucketArn
    this.certificateArn = certificate.certificateArn
    this.apiAttributes = {
      restApiId: api.restApiId,
      rootResourceId: api.restApiRootResourceId
    }
    this.distributionAttributes = {
      domainName: distribution.distributionDomainName,
      distributionId: distribution.distributionId
    }
  }
}
