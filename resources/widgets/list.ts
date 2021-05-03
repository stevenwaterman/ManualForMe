import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const S3 = new AWS.S3()
const bucketName = process.env.BUCKET

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (bucketName === undefined) throw new Error('BUCKET not set')

    const data = await S3.listObjectsV2({ Bucket: bucketName }).promise()
    const contents = data.Contents
    if (contents === undefined) throw new Error('bucket contents is undefined')

    const widgets = contents.map(e => e.Key)
    return {
      statusCode: 200,
      body: JSON.stringify({ widgets })
    }
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      body: JSON.stringify(body)
    }
  }
}
