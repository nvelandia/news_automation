// @ts-ignore
import { getS3Info } from './S3';

export const handler = async (event: any) => {
  let matchInfo = await getS3Info(event);
  console.log(matchInfo);

  console.log('File uploaded:', matchInfo);

  // Configurar el ARN de la Step Function desde la variable de entorno
  // const stateMachineArn = process.env.STATE_MACHINE_ARN;

  // if (!stateMachineArn) {
  //   throw new Error('STATE_MACHINE_ARN environment variable is not set');
  // }

  // // Iniciar la Step Function con los datos del evento S3
  // const params = {
  //   stateMachineArn: stateMachineArn,
  //   input: JSON.stringify(event),
  // };

  // await stepfunctions.startExecution(params).promise();

  // return {
  //   statusCode: 200,
  //   body: 'Step Function started!',
  // };
};
