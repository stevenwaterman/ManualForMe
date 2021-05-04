import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDB = new DynamoDB.DocumentClient()

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const data = await dynamoDB
      .scan({
        TableName: 'widgets',
        ProjectionExpression: 'username',
        Limit: 10
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({ widgets: data.Items })
    }
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      body: JSON.stringify(body)
    }
  }
}
