#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessKanbanBackendStack } from '../lib/serverless-kanban-backend-stack';

const app = new cdk.App();
new ServerlessKanbanBackendStack(app, 'ServerlessKanbanBackendStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});
