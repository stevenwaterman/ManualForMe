import { App } from '@aws-cdk/core'
import { GlobalStack } from './lib/stack/globalStack'
import { EnvironmentStack } from './lib/stack/environmentStack'

test('Empty Stack', () => {
  const app = new App()
  const { globalInfo } = new GlobalStack(app, 'GlobalStack')
  new EnvironmentStack({
    scope: app,
    id: 'EnvironmentStack',
    props: {},
    globalInfo
  })
})
