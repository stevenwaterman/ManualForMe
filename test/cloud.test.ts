import { App } from '@aws-cdk/core'
import { GlobalStack } from '../lib/globalStack'
import { EnvironmentStack } from '../lib/environmentStack'

test('Empty Stack', () => {
  const app = new App()
  // WHEN
  const { zoneAttributes, certificateArn, apiAttributes } = new GlobalStack(
    app,
    'GlobalStack'
  )
  new EnvironmentStack(app, 'EnvironmentStack', {
    zoneAttributes,
    certificateArn,
    apiAttributes
  })
})
