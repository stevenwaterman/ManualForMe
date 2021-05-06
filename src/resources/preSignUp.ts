import { PreSignUpTriggerEvent } from 'aws-lambda'

export async function handler(event: PreSignUpTriggerEvent): Promise<void> {
  event.response.autoConfirmUser = true
}
