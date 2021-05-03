import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const S3 = new AWS.S3()
const bucketName = process.env.BUCKET

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    if (bucketName === undefined) throw new Error('BUCKET not set')

    const data = await S3.listObjectsV2({ Bucket: bucketName }).promise()
    const contents = data.Contents
    if (contents === undefined)
      throw new Error('bucket contents is undefined')

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

async function httpGet(event: APIGatewayProxyEvent, widgetName: string, bucketName: string): Promise<APIGatewayProxyResult> {
  if (event.path === '/') {
    
  }

  try {
    if (widgetName) {
      const data = await S3.getObject({ Bucket: bucketName, Key: widgetName}).promise();
      if (data.Body === undefined)
        return {
          statusCode: 404,
          body: "Not Found"
        }
  
      const body = data.Body.toString('utf-8');
      return {
        statusCode: 200,
        body: JSON.stringify(body)
      };
    }
  
    return {
      statusCode: 400,
      body: 'Bad Request'
    }
  } catch (error) {
    return {
      statusCode: 404,
      body: 'Not Found'
    }
  }
}

async function httpPost(event: APIGatewayProxyEvent, widgetName: string, bucketName: string): Promise<APIGatewayProxyResult> {
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
}

async function httpDelete(event: APIGatewayProxyEvent, widgetName: string, bucketName: string): Promise<APIGatewayProxyResult> {
  if (!widgetName) return {
    statusCode: 400,
    body: "Widget name missing"
  };

  await S3.deleteObject({ Bucket: bucketName, Key: widgetName }).promise();

  return {
    statusCode: 200,
    body: `Successfully deleted widget ${widgetName}`
  };
}
