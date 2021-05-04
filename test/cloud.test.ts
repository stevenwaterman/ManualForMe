import { App } from '@aws-cdk/core'
import { ManualForMeStack } from '../lib/stack'

test('Empty Stack', () => {
  const app = new App()
  // WHEN
  new ManualForMeStack(app, 'ManualForMeStack')
})
