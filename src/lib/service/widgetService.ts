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

    const role = new Role(this, 'DbAccessLambdaRole', {
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
      path: '',
      method: 'GET',
      entry: 'widgets/list.ts',
      role,
      authorizerConfig
    })

    this.createLambda('get-widget', {
      stage,
      path: '{id}',
      method: 'GET',
      entry: 'widgets/get.ts',
      role,
      authorizerConfig
    })

    this.createLambda('add-widget', {
      stage,
      path: '{id}',
      method: 'POST',
      entry: 'widgets/add.ts',
      role,
      authorizerConfig
    })

    this.createLambda('delete-widget', {
      stage,
      path: '{id}',
      method: 'DELETE',
      entry: 'widgets/delete.ts',
      role,
      authorizerConfig
    })
  }

  private createLambda(
    id: string,
    props: {
      stage: HttpStage
      path: string
      method: string
      entry: string
      role: Role
      authorizerConfig: HttpRouteAuthorizerConfig
    }
  ): NodejsFunction {
    const handler = new NodejsFunction(this, id, {
      entry: `src/resources/${props.entry}`,
      role: props.role
    })
    handler.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'))

    // const proxyIntegration = new LambdaProxyIntegration({
    //   handler
    // }).bind({
    //   scope: this,
    //   route: {
    //     ...({} as Omit<IHttpRoute, 'httpApi'>), // Only the API is used in .bind
    //     httpApi: props.stage.api
    //   }
    // }).uri
    const integration = new CfnIntegration(this, `${id}-integration`, {
      apiId: props.stage.api.apiId,
      payloadFormatVersion: '1.0',
      integrationType: HttpIntegrationType.LAMBDA_PROXY,
      integrationMethod: props.method,
      integrationUri: handler.functionArn
    })

    new CfnRoute(this, `${id}-route`, {
      apiId: props.stage.api.apiId,
      routeKey: `${props.method} /${props.path}`,
      target: Fn.join('', ['integrations/', integration.ref]),
      ...props.authorizerConfig
    })

    return handler
  }
}
