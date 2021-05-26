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
  }
}
