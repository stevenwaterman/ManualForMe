import 'source-map-support/register'
import { App } from '@aws-cdk/core'
import { EnvironmentStack } from '../lib/stack/environmentStack'
import { GlobalStack } from '../lib/stack/globalStack'

const app = new App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1'
}

const { globalInfo } = new GlobalStack(app, 'GlobalStack', { env })
new EnvironmentStack({
  scope: app,
  id: 'EnvironmentStack',
  props: { env },
  globalInfo
})
