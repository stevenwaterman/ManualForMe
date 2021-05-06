import {
  CloudFrontWebDistribution,
  SSLMethod,
  SecurityPolicyProtocol,
  OriginProtocolPolicy
} from '@aws-cdk/aws-cloudfront'
import { ARecord, IHostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { Bucket } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { ICertificate } from '@aws-cdk/aws-certificatemanager'
import { CfnOutput, RemovalPolicy, Construct } from '@aws-cdk/core'
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets/lib'

export interface StaticSiteProps {
  certificate: ICertificate
  zone: IHostedZone
}

/**
 * Static site infrastructure, which deploys site content to an S3 bucket.
 *
 * The site redirects from HTTP to HTTPS, using a CloudFront distribution,
 * Route53 alias record, and ACM certificate.
 */
export class StaticSite extends Construct {
  constructor(
    parent: Construct,
    name: string,
    { certificate, zone }: StaticSiteProps
  ) {
    super(parent, name)

    const siteDomain = 'manualfor.me'

    new CfnOutput(this, 'Site', { value: `https://${siteDomain}` })

    // Content bucket
    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY
    })
    new CfnOutput(this, 'BucketName', { value: siteBucket.bucketName })

    // CloudFront distribution that provides HTTPS
    const distribution = new CloudFrontWebDistribution(
      this,
      'SiteDistribution',
      {
        aliasConfiguration: {
          acmCertRef: certificate.certificateArn,
          names: [siteDomain],
          sslMethod: SSLMethod.SNI,
          securityPolicy: SecurityPolicyProtocol.TLS_V1_2_2018
        },
        originConfigs: [
          {
            customOriginSource: {
              domainName: siteBucket.bucketWebsiteDomainName,
              originProtocolPolicy: OriginProtocolPolicy.HTTP_ONLY
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ]
      }
    )
    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    })

    new ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone
    })

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('svelte/public')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*']
    })
  }
}
