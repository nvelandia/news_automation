// @ts-ignore
const { getS3Info } = require('./utils/S3');
const { countries } = require('./utils/channels');
const AWS = require('aws-sdk');

interface Icountry {
  name: string;
  text: string;
}

export const handler = async (event: any) => {
  //
  const stepfunctions = new AWS.StepFunctions();
  let matchInfo = await getS3Info(event);

  console.log('matchInfo', matchInfo);

  if (!matchInfo) {
    return;
  }

  let tournament = validateCompetition(matchInfo?.match_channel);

  if (!tournament) {
    return;
  }

  console.log('tournament', tournament);

  // Definir tiempos de espera *****

  // Parámetros para iniciar la Step Function
  const params = {
    stateMachineArn: process.env.STEP_FUNCTION_ARN, // ARN de la Step Function
    input: JSON.stringify({
      waitTime1: 10,
      waitTime2: 5,
    }),
  };

  try {
    // Disparar la ejecución de la Step Function
    const data = await stepfunctions.startExecution(params).promise();
    console.log('Ejecución de Step Function iniciada:', data);
    return {
      statusCode: 200,
      body: JSON.stringify('Ejecución de Step Function iniciada con éxito!'),
    };
  } catch (error) {
    console.error('Error al iniciar Step Function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error al iniciar Step Function'),
    };
  }
};

function validateCompetition(torneo: string) {
  const result = countries.find((country: Icountry) =>
    country.name.toLowerCase().includes(torneo.toLowerCase())
  );

  if (result) {
    return { name: result.name, text: result.text };
  } else {
    return false;
  }
}
