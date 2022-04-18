import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class ServerlessKanbanBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'ServerlessKanbanUserPool', {
      signInAliases: {
        email: true,
        username: true,
      },
      selfSignUpEnabled: true,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      // TODO: Add SES email
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
