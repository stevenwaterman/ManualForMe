interface LambdaResponse {
  isBase64Encoded: boolean
  statusCode: number
  headers: Record<string, string>
  multiValueHeaders: Record<string, string[]>
  body: string
}

export function lambdaResponse({
  statusCode,
  body,
  headers
}: {
  statusCode: number
  body?: string
  headers?: Record<string, string>
}): LambdaResponse {
  return {
    isBase64Encoded: false,
    statusCode,
    headers: headers ?? {},
    multiValueHeaders: {},
    body: body ?? ''
  }
}
