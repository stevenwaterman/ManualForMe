import { Construct } from '@aws-cdk/core'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  RestApi,
  SecurityPolicy
} from '@aws-cdk/aws-apigateway'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { ManagedPolicy, Role, ServicePrincipal } from '@aws-cdk/aws-iam'
import {
  Certificate,
  CertificateValidation
} from '@aws-cdk/aws-certificatemanager'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { IUserPool } from '@aws-cdk/aws-cognito'

export class WidgetService extends Construct {
  constructor(scope: Construct, id: string, pool: IUserPool) {
    super(scope, id)

    const zone = new HostedZone(this, 'HostedZone', {
      zoneName: 'manualfor.me'
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: '*.manualfor.me',
      validation: CertificateValidation.fromDns(zone)
    })

    const authorizer = new CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      // Seems to be a versioning conflict in CDK here
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cognitoUserPools: [pool as any]
    })

    const authSettings = {
      authorizer,
      authorizationType: AuthorizationType.COGNITO
    }

    const api = new RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.',
      domainName: {
        domainName: 'www.manualfor.me',
        certificate,
        securityPolicy: SecurityPolicy.TLS_1_2
      }
    })

    const gateway = new ApiGateway(api)

    const domainAlias = api.domainName?.domainNameAliasDomainName
    if (domainAlias === undefined) throw new Error('Domain alias undefined')

    new ARecord(this, 'ARecord', {
      zone,
      target: RecordTarget.fromAlias(gateway)
    })

    const lambdaRole = new Role(this, 'DbAccessLambdaRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        )
      ]
    })

    const lambdaProps = {
      environment: {},
      role: lambdaRole
    }

    const listHandler = new NodejsFunction(this, 'ListWidgetHandler', {
      entry: 'resources/widgets/list.ts',
      ...lambdaProps
    })
    api.root.addMethod('GET', new LambdaIntegration(listHandler), authSettings)

    const idEndpoint = api.root.addResource('{id}')

    const getHandler = new NodejsFunction(this, 'GetWidgetHandler', {
      entry: 'resources/widgets/get.ts',
      ...lambdaProps
    })
    idEndpoint.addMethod('GET', new LambdaIntegration(getHandler), authSettings)

    const addHandler = new NodejsFunction(this, 'AddWidgetHandler', {
      entry: 'resources/widgets/add.ts',
      ...lambdaProps
    })
    idEndpoint.addMethod(
      'POST',
      new LambdaIntegration(addHandler),
      authSettings
    )

    const deleteHandler = new NodejsFunction(this, 'DeleteWidgetHandler', {
      entry: 'resources/widgets/delete.ts',
      ...lambdaProps
    })
    idEndpoint.addMethod(
      'DELETE',
      new LambdaIntegration(deleteHandler),
      authSettings
    )
  }
}
