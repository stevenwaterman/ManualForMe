import * as cdk from '@aws-cdk/core'
import * as widget_service from '../lib/widget-service'

export class CloudStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    new widget_service.WidgetService(this, 'Widgets')
  }
}
