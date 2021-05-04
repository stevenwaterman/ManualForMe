import { Construct } from '@aws-cdk/core'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  IAuthorizer,
  IResource,
  LambdaIntegration,
  RestApi
} from '@aws-cdk/aws-apigateway'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import { UserPool } from '@aws-cdk/aws-cognito'

export class WidgetService extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: {
      api: RestApi
      pool: UserPool
    }
  ) {
    super(scope, id)

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [props.pool]
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
      endpoint: props.api.root,
      method: 'GET',
      entry: 'widgets/list.ts',
      role,
      authorizer
    })

    const idEndpoint = props.api.root.addResource('{id}')

    this.createLambda('get-widget', {
      endpoint: idEndpoint,
      method: 'GET',
      entry: 'widgets/get.ts',
      role,
      authorizer
    })

    this.createLambda('add-widget', {
      endpoint: idEndpoint,
      method: 'POST',
      entry: 'widgets/add.ts',
      role,
      authorizer
    })

    this.createLambda('delete-widget', {
      endpoint: idEndpoint,
      method: 'DELETE',
      entry: 'widgets/delete.ts',
      role,
      authorizer
    })
  }

  private createLambda(
    id: string,
    props: {
      endpoint: IResource
      method: string
      entry: string
      role: Role
      authorizer: IAuthorizer
    }
  ): NodejsFunction {
    const handler = new NodejsFunction(this, id, {
      entry: `resources/${props.entry}`,
      role: props.role
    })
    props.endpoint.addMethod(props.method, new LambdaIntegration(handler), {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: props.authorizer
    })
    return handler
  }
}
