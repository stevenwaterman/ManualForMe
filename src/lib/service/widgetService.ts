import { Construct, Fn } from '@aws-cdk/core'
import {
  CfnIntegration,
  CfnRoute,
  HttpIntegrationType,
  HttpRouteAuthorizerConfig,
  HttpStage,
  IHttpRoute
} from '@aws-cdk/aws-apigatewayv2'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { IUserPool, UserPoolClient } from '@aws-cdk/aws-cognito'
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers'

export class WidgetService extends Construct {
  constructor(
    scope: Construct,
    id: string,
    {
      stage,
      userPool,
      userPoolClient
    }: {
      stage: HttpStage
      userPool: IUserPool
      userPoolClient: UserPoolClient
    }
  ) {
    super(scope, id)

    const route: Pick<IHttpRoute, 'httpApi'> = { httpApi: stage.api }
    const authorizerConfig = new HttpUserPoolAuthorizer({
      authorizerName: 'authorizer',
      userPool,
      userPoolClient
    }).bind({
      scope: this,
      route: route as IHttpRoute
    })

    const dbRole = new Role(this, 'DbAccessLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        )
      ]
    })

    this.createLambda('list-widgets', {
      stage,
      path: 'widgets',
      method: 'GET',
      entry: 'widgets/list.ts',
      role: dbRole
    })

    this.createLambda('get-widget', {
      stage,
      path: 'widgets/{id}',
      method: 'GET',
      entry: 'widgets/get.ts',
      role: dbRole
    })

    this.createLambda('add-widget', {
      stage,
      path: 'widgets/{id}',
      method: 'POST',
      entry: 'widgets/add.ts',
      role: dbRole,
      authorizerConfig
    })

    this.createLambda('delete-widget', {
      stage,
      path: 'widgets/{id}',
      method: 'DELETE',
      entry: 'widgets/delete.ts',
      role: dbRole,
      authorizerConfig
    })

    this.createLambda('login-redirect', {
      stage,
      path: 'login',
      method: 'GET',
      entry: 'auth/loginRedirect.ts',
      environment: {
        CLIENT_ID: userPoolClient.userPoolClientId
      }
    })

    this.createLambda('signup-redirect', {
      stage,
      path: 'signup',
      method: 'GET',
      entry: 'auth/signupRedirect.ts',
      environment: {
        CLIENT_ID: userPoolClient.userPoolClientId
      }
    })
  }

  private createLambda(
    id: string,
    props: {
      stage: HttpStage
      path: string
      method: string
      entry: string
      role?: Role
      authorizerConfig?: HttpRouteAuthorizerConfig
      environment?: Record<string, string>
    }
  ): NodejsFunction {
    const handler = new NodejsFunction(this, id, {
      entry: `src/resources/${props.entry}`,
      role: props.role,
      environment: props.environment
    })
    handler.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'))

    const integration = new CfnIntegration(this, `${id}-integration`, {
      apiId: props.stage.api.apiId,
      payloadFormatVersion: '1.0',
      integrationType: HttpIntegrationType.LAMBDA_PROXY,
      integrationMethod: props.method,
      integrationUri: handler.functionArn
    })

    const authConfig = props.authorizerConfig != null || {}

    new CfnRoute(this, `${id}-route`, {
      apiId: props.stage.api.apiId,
      routeKey: `${props.method} /${props.path}`,
      target: Fn.join('', ['integrations/', integration.ref]),
      ...authConfig
    })

    return handler
  }
}
