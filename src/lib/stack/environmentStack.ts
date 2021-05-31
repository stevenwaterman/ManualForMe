import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from '../service/widgetService'
import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { CfnDeployment, CfnStage, HttpApi } from '@aws-cdk/aws-apigatewayv2'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { Bucket } from '@aws-cdk/aws-s3'
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { UserPoolDomainTarget } from '@aws-cdk/aws-route53-targets'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { GlobalInfo } from './globalStack'

export class EnvironmentStack extends Stack {
  constructor({
    scope,
    id,
    props,
    globalInfo
  }: {
    scope: Construct
    id: string
    props: StackProps
    globalInfo: GlobalInfo
  }) {
    super(scope, id, props)

    const siteUrl = 'manualfor.me'
    const authPrefix = 'credentials'
    const authUrl = `${authPrefix}.${siteUrl}`

    const siteBucket = Bucket.fromBucketArn(
      this,
      'Bucket',
      globalInfo.bucketArn
    )
    const distribution = CloudFrontWebDistribution.fromDistributionAttributes(
      this,
      'Distribution',
      globalInfo.distributionAttributes
    )
    const certificate = Certificate.fromCertificateArn(
      this,
      'Certificate',
      globalInfo.certificateArn
    )
    const zone = HostedZone.fromHostedZoneAttributes(
      this,
      'Zone',
      globalInfo.zoneAttributes
    )
    const api = HttpApi.fromHttpApiAttributes(
      this,
      'Api',
      globalInfo.apiAttributes
    )

    // DB
    new Table(this, 'Table', {
      tableName: 'widgets',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    // Auth
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

    const domain = userPool.addDomain('PoolDomain', {
      customDomain: {
        domainName: authUrl,
        certificate
      }
    })

    new ARecord(this, 'ARecord_auth', {
      zone: zone,
      recordName: authUrl,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(domain))
    })

    const userPoolClient = userPool.addClient('AppClient', {
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

    // Api
    new CfnStage(this, 'Stage', {
      apiId: api.apiId,
      stageName: 'api',
      defaultRouteSettings: {
        throttlingRateLimit: 20,
        throttlingBurstLimit: 5
      },
      autoDeploy: false
    })

    new CfnDeployment(this, 'Deployment', {
      apiId: api.apiId,
      stageName: 'api'
    })

    new WidgetService(this, 'Widgets', { api, userPool, userPoolClient })

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('svelte/public')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*']
    })
  }
}
