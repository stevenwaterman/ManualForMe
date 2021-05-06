import {
  EndpointType,
  MockIntegration,
  RestApi,
  RestApiAttributes,
  SecurityPolicy
} from '@aws-cdk/aws-apigateway'
import {
  Certificate,
  CertificateValidation
} from '@aws-cdk/aws-certificatemanager'
import {
  ARecord,
  HostedZone,
  HostedZoneAttributes,
  RecordTarget
} from '@aws-cdk/aws-route53'
import { ApiGateway } from '@aws-cdk/aws-route53-targets'
import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core'

export class GlobalStack extends Stack {
  public readonly certificateArn: string
  public readonly zoneAttributes: HostedZoneAttributes
  public readonly apiAttributes: RestApiAttributes

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const domain = 'manualfor.me'
    const apiPrefix = 'api'

    const zone = new HostedZone(this, 'HostedZone', {
      zoneName: domain
    })

    const certificate = new Certificate(this, 'Certificate', {
      domainName: `*.${domain}`,
      subjectAlternativeNames: ['manualfor.me'],
      validation: CertificateValidation.fromDns(zone)
    })
    new CfnOutput(this, 'CertificateArn', { value: certificate.certificateArn })

    const apiUrl = `${apiPrefix}.${domain}`

    const api = new RestApi(this, 'widgets-api', {
      restApiName: 'Widget Service',
      description: 'This service serves widgets.',
      domainName: {
        domainName: apiUrl,
        certificate: certificate,
        securityPolicy: SecurityPolicy.TLS_1_2
      },
      endpointConfiguration: {
        types: [EndpointType.REGIONAL]
      }
    })

    api.root.addResource('health').addMethod('GET', new MockIntegration())

    const gateway = new ApiGateway(api)

    new ARecord(this, 'ARecord_Api', {
      zone: zone,
      target: RecordTarget.fromAlias(gateway),
      recordName: apiUrl
    })

    this.zoneAttributes = {
      hostedZoneId: zone.hostedZoneId,
      zoneName: zone.zoneName
    }
    this.certificateArn = certificate.certificateArn
    this.apiAttributes = {
      restApiId: api.restApiId,
      rootResourceId: api.restApiRootResourceId
    }
  }
}
