/*
This code uses callbacks to handle asynchronous function responses.
It currently demonstrates using an async-await pattern.
AWS supports both the async-await and promises patterns.
For more information, see the following:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/calling-services-asynchronously.html
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
*/
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
const S3 = new AWS.S3()

const bucketName = process.env.BUCKET

export default async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (bucketName === undefined) throw new Error('BUCKET not set')

    const method = event.httpMethod

    if (method !== 'GET') {
      return {
        statusCode: 400,
        headers: {},
        body: 'We only accept GET /'
      }
    }

    if (event.path === '/') {
      const data = await S3.listObjectsV2({ Bucket: bucketName }).promise()
      const contents = data.Contents
      if (contents === undefined)
        throw new Error('bucket contents is undefined')

      const widgets = contents.map(e => e.Key)
      return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({ widgets })
      }
    }

    return {
      statusCode: 404,
      headers: {},
      body: 'Not Found'
    }
  } catch (error) {
    const body = error.stack ?? JSON.stringify(error, null, 2)
    return {
      statusCode: 500,
      headers: {},
      body: JSON.stringify(body)
    }
  }
}
