import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from '../lib/widget-service'
import { Database } from './database'

export class ManualForMeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new Database(this, 'Database')
    new WidgetService(this, 'Widgets')
  }
}
