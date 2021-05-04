import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
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
          required: true
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

    this.pool.addDomain('PoolDomain', {
      cognitoDomain: {
        domainPrefix: 'manualforme-auth'
      }
    })

    this.pool.addClient('AppClient', {
      generateSecret: true,
      authFlows: {
        adminUserPassword: true,
        userPassword: true
      },
      preventUserExistenceErrors: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: false,
          clientCredentials: false
        },
        scopes: [OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: ['https://manualfor.me/authSuccess'],
        logoutUrls: ['https://manualfor.me/signedOut']
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO]
    })
  }
}
