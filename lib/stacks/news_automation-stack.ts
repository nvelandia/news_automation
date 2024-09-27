// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
// import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
// import * as path from 'path';

// export class NewsAutomationStack extends cdk.Stack {
//   constructor(scope: Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // Environment
//     const bucketName: string = process.env.BUCKET || 'dev';

//     // Referenciar el bucket S3 existente
//     const bucket = s3.Bucket.fromBucketName(this, 'ExistingBucket', bucketName);

//     // Crear la Step Function
//     const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
//       definition: new sfn.Pass(this, 'Start'), // Placeholder para definir los pasos luego
//     });

//     // Crear la Lambda que procesará el archivo
//     const processFileLambda = new ProcessFileLambda(
//       this,
//       'ProcessFileLambda',
//       stateMachine
//     );

//     // Crear el evento para activar la Lambda cuando se agregue un archivo en el prefijo "mam_test/"
//     bucket.addEventNotification(
//       s3.EventType.OBJECT_CREATED_PUT,
//       new s3n.LambdaDestination(processFileLambda.lambdaFunction),
//       { prefix: 'mam_test/' }
//     );

//     // Permisos para que S3 invoque la Lambda
//     bucket.grantRead(processFileLambda.lambdaFunction);

//     // Exportar el ARN de la State Machine
//     new cdk.CfnOutput(this, 'StateMachineArn', {
//       value: stateMachine.stateMachineArn,
//     });
//   }
// }

// export class ProcessFileLambda extends Construct {
//   public readonly lambdaFunction: lambda.IFunction;

//   constructor(scope: Construct, id: string, stateMachine: sfn.StateMachine) {
//     super(scope, id);

//     this.lambdaFunction = new lambda.Function(this, 'LambdaFunction', {
//       runtime: lambda.Runtime.NODEJS_18_X,
//       handler: 'index.handler',
//       code: lambda.Code.fromAsset(
//         path.join(__dirname, '..', 'lambdas/process-file')
//       ),
//       environment: {
//         STATE_MACHINE_ARN: stateMachine.stateMachineArn,
//       },
//     });

//     // Permisos para que la Lambda inicie la Step Function
//     stateMachine.grantStartExecution(this.lambdaFunction);
//   }
// }

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
    // Crear el evento para activar la Lambda cuando se agregue un archivo en el prefijo "mam_test/"

    // Lambda one
    const oneLambda = new lambda.Function(this, 'oneLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async () => {
          console.log('lambda one');
        };
      `),
    });

    // Lambda two
    const twoLambda = new lambda.Function(this, 'twoLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async () => {
          console.log('lambda two');
        };
      `),
    });

    // Lambda three
    const threeLambda = new lambda.Function(this, 'threeLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async () => {
          console.log('lambda three');
        };
      `),
    });

    // Step 1: Lambda one
    const oneLambdaTask = new tasks.LambdaInvoke(this, 'Invoke oneLambda', {
      lambdaFunction: oneLambda,
    });

    // Step 2: Wait for the specified time (in seconds)
    const waitTime1 = new sfn.Wait(this, 'Wait for time 1', {
      time: sfn.WaitTime.secondsPath('$.waitTime1'),
    });

    // Step 3: Lambda two
    const twoLambdaTask = new tasks.LambdaInvoke(this, 'Invoke twoLambda', {
      lambdaFunction: twoLambda,
    });

    // Step 4: Wait for the specified time (in seconds)
    const waitTime2 = new sfn.Wait(this, 'Wait for time 2', {
      time: sfn.WaitTime.secondsPath('$.waitTime2'),
    });

    // Step 5: Lambda three
    const threeLambdaTask = new tasks.LambdaInvoke(this, 'Invoke threeLambda', {
      lambdaFunction: threeLambda,
    });

    // Definir la cadena de pasos de la Step Function
    const definition = oneLambdaTask
      .next(waitTime1)
      .next(twoLambdaTask)
      .next(waitTime2)
      .next(threeLambdaTask);

    // Crear la Step Function
    const stepFunction = new sfn.StateMachine(this, 'StepFunction', {
      definition,
      timeout: cdk.Duration.minutes(5),
    });

    // Lambda listenBucket (disparadora de la Step Function)
    const processFileLambda = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', 'lambdas/process-file')
      ),
      environment: {
        STEP_FUNCTION_ARN: stepFunction.stateMachineArn, // Pasamos el ARN de la Step Function como variable de entorno
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
