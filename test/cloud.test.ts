import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as Cloud from '../lib/manualforme-stack'

test('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new Cloud.CloudStack(app, 'MyTestStack')
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {}
      },
      MatchStyle.EXACT
    )
  )
})
