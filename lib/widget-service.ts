import * as core from '@aws-cdk/core'
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import { Bucket } from '@aws-cdk/aws-s3'

export class WidgetService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id)

    const bucket = new Bucket(this, 'WidgetStore')

    const api = new RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.'
    })

    const listHandler = new NodejsFunction(this, 'ListWidgetHandler', {
      entry: 'resources/widgets/list.ts',
      environment: { BUCKET: bucket.bucketName }
    })
    bucket.grantReadWrite(listHandler)
    api.root.addMethod("GET", new LambdaIntegration(listHandler));


    const idEndpoint = api.root.addResource("{id}")


    const getHandler = new NodejsFunction(this, 'GetWidgetHandler', {
      entry: 'resources/widgets/get.ts',
      environment: { BUCKET: bucket.bucketName }
    })
    bucket.grantReadWrite(getHandler)
    idEndpoint.addMethod("GET", new LambdaIntegration(getHandler));


    const addHandler = new NodejsFunction(this, 'AddWidgetHandler', {
      entry: 'resources/widgets/add.ts',
      environment: { BUCKET: bucket.bucketName }
    })
    bucket.grantReadWrite(addHandler)
    idEndpoint.addMethod("POST", new LambdaIntegration(addHandler));


    const deleteHandler = new NodejsFunction(this, 'DeleteWidgetHandler', {
      entry: 'resources/widgets/delete.ts',
      environment: { BUCKET: bucket.bucketName }
    })
    bucket.grantReadWrite(deleteHandler)
    idEndpoint.addMethod("DELETE", new LambdaIntegration(deleteHandler));
  }
}
