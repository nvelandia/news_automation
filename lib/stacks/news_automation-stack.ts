import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';

export class NewsAutomationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Environment
    const bucketName: string = process.env.BUCKET || 'dev';
    const bucket = s3.Bucket.fromBucketName(this, 'ExistingBucket', bucketName);

    const oneLambda = new lambda.Function(this, 'oneLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas/stepOneCreateNote')
      ),
    });

    const twoLambda = new lambda.Function(this, 'twoLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas/stepTwoPublishNote')
      ),
    });

    // Step Functions ----------

    // Step 1
    const waitTime1 = new sfn.Wait(this, 'Wait 24 before', {
      time: sfn.WaitTime.secondsPath('$.waitTime1'),
    });
    // Step 2
    const oneLambdaTask = new tasks.LambdaInvoke(this, 'Invoke oneLambda', {
      lambdaFunction: oneLambda,
      outputPath: '$.Payload',
    });
    // Step 3
    const waitTime2 = new sfn.Wait(this, 'Wait 1 before', {
      time: sfn.WaitTime.secondsPath('$.waitTime2'),
    });
    // Step 4
    const twoLambdaTask = new tasks.LambdaInvoke(this, 'Invoke twoLambda', {
      lambdaFunction: twoLambda,
      inputPath: '$',
      outputPath: '$.Payload',
    });

    const definition = waitTime1
      .next(oneLambdaTask)
      .next(waitTime2)
      .next(twoLambdaTask);

    const stepFunction = new sfn.StateMachine(this, 'StepFunction', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });

    // ----------

    // Lambda listenBucket (disparadora de la Step Function)
    const processFileLambda = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas/process-file')
      ),
      environment: {
        STEP_FUNCTION_ARN: stepFunction.stateMachineArn,
      },
    });

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(processFileLambda),
      { prefix: 'mam_test/' }
    );

    // Permisos para que S3 invoque la Lambda
    bucket.grantRead(processFileLambda);

    // Permisos para que la lambda listenBucket dispare la Step Function
    stepFunction.grantStartExecution(processFileLambda);
  }
}
