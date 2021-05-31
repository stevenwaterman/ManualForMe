import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { lambdaResponse } from '../lambdaResponse'

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const queryParams: Record<string, string | undefined> =
    event.queryStringParameters ?? {}
  const redirect = queryParams.redirect
  if (redirect === undefined)
    return lambdaResponse({
      statusCode: 400,
      body: 'Missing redirect query parameter'
    })

  const clientId = process.env.CLIENT_ID
  if (clientId === undefined)
    return lambdaResponse({
      statusCode: 500,
      body: 'Missing cognito client ID'
    })

  const location = `https://credentials.manualfor.me/login?client_id=${clientId}&response_type=token&scope=email+openid+profile&redirect_uri=${redirect}/authSuccess`
  return lambdaResponse({ statusCode: 302, headers: { location } })
}
