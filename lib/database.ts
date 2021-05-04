import { Construct, RemovalPolicy } from '@aws-cdk/core'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'

export class Database extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id)

    new Table(this, 'Table', {
      tableName: 'widgets',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
