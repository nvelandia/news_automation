import { APIGatewayProxyEvent } from 'aws-lambda';

// @ts-ignore
const { getS3Info } = require('./utils/S3');
const { tournament } = require('./utils/channels');
const AWS = require('aws-sdk');

interface Icountry {
  name: string;
  text: string;
}

export const handler = async (event: APIGatewayProxyEvent) => {
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

  // Parámetros para iniciar la Step Function
  const params = {
    stateMachineArn: process.env.STEP_FUNCTION_ARN, // ARN de la Step Function
    input: JSON.stringify({
      match_id: matchInfo.match_id,
      match_start: matchInfo.match_start,
      waitTime1: calculateWaitTimes(matchInfo.match_start, 24),
      waitTime2: calculateWaitTimes(matchInfo.match_start, 1),
      tournament: tournament,
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
  const result = tournament.find((country: Icountry) =>
    country.name.toLowerCase().includes(torneo.toLowerCase())
  );

  if (result) {
    return { name: result.name, text: result.text };
  } else {
    return false;
  }
}

function calculateWaitTimes(match_start: string, time: number) {
  // return `2024-10-02T18:${time}:00.000Z`;
  const originalDate = new Date(match_start);

  const hoursBefore = new Date(originalDate);
  hoursBefore.setHours(originalDate.getHours() - time);

  const targetDate = new Date(hoursBefore);
  const timestamp = targetDate.getTime();

  console.log(match_start, ` ${time} `, hoursBefore, ' ', timestamp);

  return hoursBefore;
}
