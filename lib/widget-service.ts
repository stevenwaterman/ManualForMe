import * as core from '@aws-cdk/core'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda_nodejs from '@aws-cdk/aws-lambda-nodejs'
import * as s3 from '@aws-cdk/aws-s3'

export class WidgetService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id)

    const bucket = new s3.Bucket(this, 'WidgetStore')

    const handler = new lambda_nodejs.NodejsFunction(this, 'WidgetHandler', {
      entry: 'resources/widgets.ts',
      handler: 'main',
      environment: {
        BUCKET: bucket.bucketName
      }
    })

    bucket.grantReadWrite(handler)

    const api = new apigateway.RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.'
    })

    const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' }
    })

    api.root.addMethod('GET', getWidgetsIntegration)
  }
}
