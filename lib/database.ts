import * as cdk from '@aws-cdk/core'
import {
  ServerlessCluster,
  DatabaseClusterEngine,
  AuroraPostgresEngineVersion
} from '@aws-cdk/aws-rds'
import { IVpc } from '@aws-cdk/aws-ec2'

export class Database extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, vpc: IVpc) {
    super(scope, id)

    new ServerlessCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_10_14
      }),
      vpc
    })
  }
}
