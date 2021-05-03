import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const S3 = new AWS.S3()
const bucketName = process.env.BUCKET

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (bucketName === undefined) throw new Error('BUCKET not set')

    const widgetName = event.path.startsWith('/')
      ? event.path.substring(1)
      : event.path
    if (widgetName.length === 0)
      return {
        statusCode: 400,
        body: 'Widget name missing'
      }

    await S3.deleteObject({ Bucket: bucketName, Key: widgetName }).promise()

    return {
      statusCode: 200,
      body: `Successfully deleted widget ${widgetName}`
    }
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      body: JSON.stringify(body)
    }
  }
}
