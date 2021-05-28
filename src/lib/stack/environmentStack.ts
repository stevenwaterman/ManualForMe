import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from '../service/widgetService'
import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import {
  HttpApi,
  HttpApiAttributes,
  HttpStage
} from '@aws-cdk/aws-apigatewayv2'
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
      distributionAttributes: CloudFrontWebDistributionAttributes
      bucketArn: string
      apiAttributes: HttpApiAttributes
      userPoolId: string
    }
  }) {
    super(scope, id, props)

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

    const userPool = UserPool.fromUserPoolId(this, 'UserPool', props.userPoolId)

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

    const api = HttpApi.fromHttpApiAttributes(this, 'Api', props.apiAttributes)
    const stage = new HttpStage(this, 'Stage', {
      httpApi: api,
      stageName: 'api',
      autoDeploy: true
    })

    new WidgetService(this, 'Widgets', { stage, userPool, userPoolClient })

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [Source.asset('svelte/public')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*']
    })
  }
}
