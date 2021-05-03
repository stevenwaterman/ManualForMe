import * as cdk from '@aws-cdk/core'
import { ManualForMeStack } from '../lib/manualforme-stack'

test('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  new ManualForMeStack(app, 'ManualForMeStack')
})
