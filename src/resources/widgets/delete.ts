import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { lambdaResponse } from '../lambdaResponse'

const dynamoDB = new DynamoDB.DocumentClient()

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const widgetName = event.path.startsWith('/')
      ? event.path.substring(1)
      : event.path
    if (widgetName.length === 0)
      return {
        statusCode: 400,
        body: 'Widget name missing'
      }

    await dynamoDB
      .delete({
        TableName: 'widgets',
        Key: {
          username: widgetName
        }
      })
      .promise()

    return lambdaResponse(200, 'Success')
  } catch (error) {
    const body: string =
      JSON.stringify(error.stack) ?? JSON.stringify(error, null, 2)
    return lambdaResponse(500, body)
  }
}
