import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sns_subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as s3_notifications from 'aws-cdk-lib/aws-s3-notifications';

export class NewsAutomationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Environment
    const bucketName: string = process.env.BUCKET || 'dev';
    const bucket = s3.Bucket.fromBucketName(this, 'ExistingBucket', bucketName);

    const securityGroupId = process.env.SECURITY_GROUP!;
    const subnetId1 = process.env.SUBNET_ID1!;
    const subnetId2 = process.env.SUBNET_ID2!;

    const vpc = ec2.Vpc.fromVpcAttributes(this, 'ImportedVpc', {
      vpcId: process.env.VPC_ID!,
      availabilityZones: ['us-east-1a', 'us-east-1b'], // Availability Zones
    });

    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'ImportedSecurityGroup',
      securityGroupId // Reemplaza con el ID de tu Security Group
    );

    // Import the subnets
    const subnet1 = ec2.Subnet.fromSubnetId(this, 'Subnet1', subnetId1);
    const subnet2 = ec2.Subnet.fromSubnetId(this, 'Subnet2', subnetId2);

    const oneLambda = new NodejsFunction(this, 'oneLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '..', 'lambdas/stepOneCreateNote.ts'),
      vpc: vpc,
      securityGroups: [securityGroup],
      vpcSubnets: {
        subnets: [subnet1, subnet2], // Pass the imported subnets here
      },
      environment: {
        TABLE_CONTENIDO: process.env.TABLE_CONTENIDO || '',
        TABLE_NOTA: process.env.TABLE_NOTA || '',
        MYSQL_HOST: process.env.MYSQL_HOST || '',
        MYSQL_USER: process.env.MYSQL_USER || '',
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
        PUBLICATION_URL: process.env.PUBLICATION_URL || '',
      },
    });

    const twoLambda = new NodejsFunction(this, 'twoLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '..', 'lambdas/stepTwoPublishNote.ts'),
      vpc: vpc,
      securityGroups: [securityGroup],
      vpcSubnets: {
        subnets: [subnet1, subnet2], // Pass the imported subnets here
      },
      environment: {
        TABLE_CONTENIDO: process.env.TABLE_CONTENIDO || '',
        TABLE_NOTA: process.env.TABLE_NOTA || '',
        MYSQL_HOST: process.env.MYSQL_HOST || '',
        MYSQL_USER: process.env.MYSQL_USER || '',
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
        PUBLICATION_URL: process.env.PUBLICATION_URL || '',
      },
    });

    // Step Functions ----------

    // Step 1
    const waitTime1 = new sfn.Wait(this, 'Wait 24 before', {
      time: sfn.WaitTime.timestampPath('$.waitTime1'),
    });
    // Step 2
    const oneLambdaTask = new tasks.LambdaInvoke(this, 'Invoke oneLambda', {
      lambdaFunction: oneLambda,
      outputPath: '$.Payload',
    });
    // Step 3
    const waitTime2 = new sfn.Wait(this, 'Wait 1 before', {
      time: sfn.WaitTime.timestampPath('$.waitTime2'),
    });
    // Step 4
    const twoLambdaTask = new tasks.LambdaInvoke(this, 'Invoke twoLambda', {
      lambdaFunction: twoLambda,
      inputPath: '$',
      outputPath: '$.Payload',
    });

    // const definition = waitTime1
    //   .next(oneLambdaTask)
    //   .next(waitTime2)
    //   .next(twoLambdaTask);

    const definition = oneLambdaTask.next(twoLambdaTask);

    const stepFunction = new sfn.StateMachine(this, 'StepFunction', {
      definition,
      timeout: cdk.Duration.hours(48),
    });

    // ----------

    // Lambda disparadora de la Step Function
    const processFileLambda = new NodejsFunction(this, 'LambdaFunction', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: path.join(__dirname, '..', 'lambdas/process-file.ts'),
      vpc: vpc,
      securityGroups: [securityGroup],
      vpcSubnets: {
        subnets: [subnet1, subnet2], // Pass the imported subnets here
      },
      environment: {
        STEP_FUNCTION_ARN: stepFunction.stateMachineArn,
        MYSQL_HOST: process.env.MYSQL_HOST || '',
        MYSQL_USER: process.env.MYSQL_USER || '',
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '',
        MYSQL_DATABASE: process.env.MYSQL_DATABASE || '',
      },
    });

    // Crear un tema SNS
    const topic = new sns.Topic(this, 'S3NotificationNewsAutomation');

    // Suscribir la Lambda interna al tema SNS
    topic.addSubscription(
      new sns_subscriptions.LambdaSubscription(processFileLambda)
    );

    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3_notifications.SnsDestination(topic),
      { prefix: 'mam_test/' }
    );

    // Permisos para que S3 invoque la Lambda
    bucket.grantRead(processFileLambda);

    // Permisos para que la lambda listenBucket dispare la Step Function
    stepFunction.grantStartExecution(processFileLambda);
  }
}
