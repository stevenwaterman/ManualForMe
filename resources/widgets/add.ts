import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const S3 = new AWS.S3()
const bucketName = process.env.BUCKET

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (bucketName === undefined) throw new Error('BUCKET not set')

    const widgetName = event.path.startsWith('/') ? event.path.substring(1) : event.path
    if (!widgetName) return {
      statusCode: 400,
      body: "Widget name missing"
    }
  
    const data = `${widgetName} created: ${new Date()}`;
    const base64data = new Buffer(data, 'binary');
  
    await S3.putObject({
      Bucket: bucketName,
      Key: widgetName,
      Body: base64data,
      ContentType: 'application/json'
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(data)
    };
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      body: JSON.stringify(body)
    }
  }
}
