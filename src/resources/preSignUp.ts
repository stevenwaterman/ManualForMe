import { PreSignUpTriggerEvent } from 'aws-lambda'

export async function handler(event: PreSignUpTriggerEvent): Promise<PreSignUpTriggerEvent> {
  event.response.autoConfirmUser = true;
  return event;
}
