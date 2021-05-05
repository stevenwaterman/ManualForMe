import 'source-map-support/register'
import { App } from '@aws-cdk/core'
import { EnvironmentStack } from '../lib/stack/environmentStack'
import { GlobalStack } from '../lib/stack/globalStack'

const app = new App()

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1'
}

const { zoneAttributes, certificateArn, apiAttributes } = new GlobalStack(
  app,
  'GlobalStack',
  {
    env
  }
)
new EnvironmentStack(app, 'EnvironmentStack', {
  env,
  zoneAttributes,
  certificateArn,
  apiAttributes
})
