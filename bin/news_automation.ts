#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NewsAutomationStack } from '../lib/stacks/news_automation-stack';
import { getAppConfig } from './getAppConfig';

// Set deployment environment
const appConfig = getAppConfig();
const apiName: string = 'News_Automation_' + appConfig.deploymentEnv;
console.log('apiName: ', apiName);

// Initialize CDK application
const app = new cdk.App();

const project = new NewsAutomationStack(app, 'NewsAutomationStack', {});
