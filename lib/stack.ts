import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from './widget-service'
import { Database } from './database'
import { Auth } from './auth'

export class ManualForMeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const auth = new Auth(this, 'Auth')
    new Database(this, 'Database')
    new WidgetService(this, 'Widgets', auth.pool)
  }
}
