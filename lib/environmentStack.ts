import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from './widget-service'
import { Certificate } from '@aws-cdk/aws-certificatemanager'
import { ARecord, HostedZone, HostedZoneAttributes, RecordTarget } from '@aws-cdk/aws-route53'
import { UserPoolDomainTarget } from '@aws-cdk/aws-route53-targets'
import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { RestApi, RestApiAttributes } from '@aws-cdk/aws-apigateway'

export class EnvironmentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & {
      zoneAttributes: HostedZoneAttributes
      certificateArn: string
      apiAttributes: RestApiAttributes
    }
  ) {
    super(scope, id, props)

    const zone = HostedZone.fromHostedZoneAttributes(this, 'Zone', props.zoneAttributes)
    const certificate = Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn
    )
    const api = RestApi.fromRestApiAttributes(this, 'Api', props.apiAttributes)

    new Table(this, 'Table', {
      tableName: 'widgets',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const pool = new UserPool(this, 'pool', {
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

    pool.addClient('AppClient', {
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

    new WidgetService(this, 'Widgets', { api, pool })

    const domain = pool.addDomain('PoolDomain', {
      customDomain: {
        domainName: 'auth.manualfor.me',
        certificate
      }
    })

    const target = new UserPoolDomainTarget(domain)
    new ARecord(this, 'ARecord_auth', {
      zone: zone,
      recordName: 'auth.manualfor.me',
      target: RecordTarget.fromAlias(target)
    })
  }
}
