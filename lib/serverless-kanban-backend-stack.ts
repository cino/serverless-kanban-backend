import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { BooleanAttribute, Mfa, UserPoolEmail } from 'aws-cdk-lib/aws-cognito';
import { VerifySesDomain } from '@seeebiii/ses-verify-identities';

interface ServerlessKanbanStackProps extends StackProps {
  rootDomain: string;
}

export class ServerlessKanbanBackendStack extends Stack {
  constructor(scope: Construct, id: string, props: ServerlessKanbanStackProps) {
    super(scope, id, props);

    // Verify SES Domain
    new VerifySesDomain(this, 'VerifySesDomain', {
      domainName: 'kanban.cino.io',
      hostedZoneName: props.rootDomain,
      addMxRecord: false,
    });

    const userPool = new cognito.UserPool(this, 'ServerlessKanbanUserPool', {
      signInAliases: {
        email: true,
        username: true,
      },
      selfSignUpEnabled: true,
      // auto verify for now.
      autoVerify: {
        email: true,
      },

      // TODO: Re-Look at this once https://github.com/aws/aws-cdk/pull/19790is merged and released
      // email: UserPoolEmail.withSES({
      //   replyTo: 'no-reply@kanban.cino.io',
      //   fromName: 'Serverless Kanban',
      // }),
      email: UserPoolEmail.withCognito('no-reply@kanban.cino.io'),

      // Multi-Factor is optionally available and only by a On-Time-Password as SMS
      // is considered insecure and I'm not paying for that.
      mfa: Mfa.OPTIONAL,
      mfaSecondFactor: {
        sms: false,
        otp: true,
      },

      // Extra attributes in Cognito to store Email preferences
      customAttributes: {
        notifyItemUpdated: new BooleanAttribute({ mutable: true }),
        notifyMentioned: new BooleanAttribute({ mutable: true }),
      },
    });
    const client = userPool.addClient('ServerlessKanbanWebClient');

    new CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
      exportName: 'serverlessKanbanUserPoolId',
    });

    new CfnOutput(this, 'userPoolClientId', {
      value: client.userPoolClientId,
      exportName: 'serverlessKanbanUserPoolClientId',
    });
  }
}
