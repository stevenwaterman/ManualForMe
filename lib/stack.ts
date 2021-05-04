import { Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core'
import { WidgetService } from './widget-service'
import {
  Certificate,
  CertificateValidation
} from '@aws-cdk/aws-certificatemanager'
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53'
import { ApiGateway, UserPoolDomainTarget } from '@aws-cdk/aws-route53-targets'
import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider
} from '@aws-cdk/aws-cognito'
import { AttributeType, BillingMode, Table } from '@aws-cdk/aws-dynamodb'
import { EndpointType, RestApi, SecurityPolicy } from '@aws-cdk/aws-apigateway'

export class ManualForMeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new Table(this, 'Table', {
      tableName: 'widgets',
      partitionKey: { name: 'username', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const zone = new HostedZone(this, 'HostedZone', {
      zoneName: 'manualfor.me'
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: '*.manualfor.me',
      validation: CertificateValidation.fromDns(zone)
    })

    const api = new RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.',
      domainName: {
        domainName: 'www.manualfor.me',
        certificate: certificate,
        securityPolicy: SecurityPolicy.TLS_1_2
      },
      endpointConfiguration: {
        types: [EndpointType.REGIONAL]
      }
    })

    const gateway = new ApiGateway(api)

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

    new ARecord(this, 'ARecord_Apex', {
      zone: zone,
      target: RecordTarget.fromAlias(gateway)
    })

    new ARecord(this, 'ARecord_WWW', {
      zone: zone,
      recordName: 'www.manualfor.me',
      target: RecordTarget.fromAlias(gateway)
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
