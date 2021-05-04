import { App } from '@aws-cdk/core'
import { ManualForMeStack } from '../lib/manualforme-stack'

test('Empty Stack', () => {
  const app = new App()
  // WHEN
  new ManualForMeStack(app, 'ManualForMeStack')
})
