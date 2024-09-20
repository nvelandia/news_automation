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

    // Referenciar el bucket S3 existente
    const bucket = s3.Bucket.fromBucketName(this, 'ExistingBucket', bucketName);

    // Crear la Step Function
    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition: new sfn.Pass(this, 'Start'), // Placeholder para definir los pasos luego
    });

    // Crear la Lambda que procesará el archivo
    const processFileLambda = new ProcessFileLambda(
      this,
      'ProcessFileLambda',
      stateMachine
    );

    // Crear el evento para activar la Lambda cuando se agregue un archivo en el prefijo "mam_test/"
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED_PUT,
      new s3n.LambdaDestination(processFileLambda.lambdaFunction),
      { prefix: 'mam_test/' }
    );

    // Permisos para que S3 invoque la Lambda
    bucket.grantRead(processFileLambda.lambdaFunction);

    // Exportar el ARN de la State Machine
    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

export class ProcessFileLambda extends Construct {
  public readonly lambdaFunction: lambda.IFunction;

  constructor(scope: Construct, id: string, stateMachine: sfn.StateMachine) {
    super(scope, id);

    this.lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas/process-file')
      ),
      environment: {
        STATE_MACHINE_ARN: stateMachine.stateMachineArn,
      },
    });

    // Permisos para que la Lambda inicie la Step Function
    stateMachine.grantStartExecution(this.lambdaFunction);
  }
}
