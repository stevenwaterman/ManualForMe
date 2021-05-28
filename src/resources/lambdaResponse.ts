interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  headers: Record<string, string>
  multiValueHeaders: Record<string, string[]>
  body: string
}

export function lambdaResponse(
  statusCode: number,
  body: string
): LambdaResponse {
  return {
    isBase64Encoded: false,
    statusCode,
    headers: {},
    multiValueHeaders: {},
    body
  }
}
