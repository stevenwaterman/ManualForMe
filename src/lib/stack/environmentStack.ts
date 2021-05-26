import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from '../service/widgetService'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import {
  ARecord,
  HostedZone,
  HostedZoneAttributes,
  RecordTarget
} from '@aws-cdk/aws-route53'
import { UserPoolDomainTarget } from '@aws-cdk/aws-route53-targets'
import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { RestApi, RestApiAttributes } from '@aws-cdk/aws-apigateway'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { Bucket } from '@aws-cdk/aws-s3'
import {
  CloudFrontWebDistribution,
  CloudFrontWebDistributionAttributes
} from '@aws-cdk/aws-cloudfront'

export class EnvironmentStack extends Stack {
  constructor({
    scope,
    id,
    props
  }: {
    scope: Construct
    id: string
    props: StackProps & {
      zoneAttributes: HostedZoneAttributes
      distributionAttributes: CloudFrontWebDistributionAttributes
      bucketArn: string
      certificateArn: string
      apiAttributes: RestApiAttributes
    }
  }) {
    super(scope, id, props)

    const zone = HostedZone.fromHostedZoneAttributes(
      this,
      'Zone',
      props.zoneAttributes
    )
    const certificate = Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn
    )
    const siteBucket = Bucket.fromBucketArn(this, 'Bucket', props.bucketArn)
    const distribution = CloudFrontWebDistribution.fromDistributionAttributes(
      this,
      'Distribution',
      props.distributionAttributes
    )

    new Table(this, 'Table', {
      tableName: 'widgets',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const preSignUp = new NodejsFunction(this, 'PreSignUp', {
      entry: `src/resources/preSignUp.ts`
    })

    const pool = new UserPool(this, 'pool', {
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

    pool.addClient('AppClient', {
      generateSecret: true,
      authFlows: { userPassword: true },
      preventUserExistenceErrors: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: false,
          implicitCodeGrant: true,
          clientCredentials: false
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: [
          'https://manualfor.me/authSuccess',
          'http://localhost:5000/authSuccess'
        ],
        logoutUrls: ['https://manualfor.me', 'http://localhost:5000']
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
    })

    const api = RestApi.fromRestApiAttributes(this, 'Api', props.apiAttributes)
    new WidgetService(this, 'Widgets', { api, pool })

    const authPrefix = 'auth2'

    const domain = pool.addDomain('PoolDomain', {
      customDomain: {
        domainName: `${authPrefix}.manualfor.me`,
        certificate
      }
    })

    const target = new UserPoolDomainTarget(domain)
    new ARecord(this, 'ARecord_auth', {
      zone: zone,
      recordName: `${authPrefix}.manualfor.me`,
      target: RecordTarget.fromAlias(target)
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
