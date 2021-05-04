import { UserPool } from '@aws-cdk/aws-cognito'
import { Construct, RemovalPolicy } from '@aws-cdk/core'

export class Auth extends Construct {
  public readonly pool: UserPool

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.pool = new UserPool(this, 'pool', {
      userPoolName: 'manualforme-userpool',
      selfSignUpEnabled: true,
      enableSmsRole: false,
      standardAttributes: {
        fullname: {
          mutable: true,
          required: true
        },
        email: {
          mutable: true,
          required: false
        },
        profilePicture: {
          mutable: true,
          required: false
        }
      },
      passwordPolicy: {
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false
      },
      signInCaseSensitive: false,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
