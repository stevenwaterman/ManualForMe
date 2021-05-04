import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

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

    const widget = {
      username: widgetName,
      value: `${widgetName} created: ${new Date()}`
    }

    await dynamoDB
      .put({
        TableName: 'widgets',
        Item: widget
      })
      .promise()

    return {
      statusCode: 201,
      body: 'Success'
    }
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      body: JSON.stringify(body)
    }
  }
}
