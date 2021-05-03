import { Vpc } from '@aws-cdk/aws-ec2'
import * as cdk from '@aws-cdk/core'
import { WidgetService } from '../lib/widget-service'
import { Database } from './database'

export class ManualForMeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const vpc = new Vpc(this, 'vpc')

    new WidgetService(this, 'Widgets', vpc)
    new Database(this, 'Database', vpc)
  }
}
