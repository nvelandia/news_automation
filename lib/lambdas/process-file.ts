// @ts-ignore
const { getS3Info } = require('../utils/S3');
const { tournament } = require('../utils/channels');
const Service = require('../utils/Service');
const AWS = require('aws-sdk');

interface Icountry {
  name: string;
  text: string;
}

export const handler = async (event: any, context: any) => {
  //
  const snsMessage = event.Records[0].Sns.Message;
  const s3Event = JSON.parse(snsMessage);

  const stepfunctions = new AWS.StepFunctions();
  let matchInfo = await getS3Info(s3Event);

  try {
    if (!matchInfo) {
      console.log('MatchInfo invalid');
      return;
    }

    let tournament = validateCompetition(matchInfo?.match_channel);
    if (!tournament) {
      console.log('Tournament invalid');
      return;
    }

    let matchFound = await Service.getMatchById(
      matchInfo.match_id,
      'df_match_prev'
    );

    if (!matchFound) {
      // Parámetros para iniciar la Step Function
      const params = {
        stateMachineArn: process.env.STEP_FUNCTION_ARN,
        input: JSON.stringify({
          match_id: matchInfo.match_id,
          match_start: matchInfo.match_start,
          waitTime1: calculateWaitTimes(matchInfo.match_start, 24),
          waitTime2: calculateWaitTimes(matchInfo.match_start, 1),
          tournament: tournament,
        }),
      };

      // Disparar la ejecución de la Step Function
      const data = await stepfunctions.startExecution(params).promise();
      console.log('Ejecución de Step Function iniciada:', data);
      return {
        statusCode: 200,
        body: JSON.stringify('Ejecución de Step Function iniciada con éxito!'),
      };
    } else {
      console.log('Previa del partido ya fue creada');
      return;
    }
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
    return result;
  } else {
    return false;
  }
}

function calculateWaitTimes(match_start: string, time: number) {
  const localDate = new Date(match_start.replace(' ', 'T') + '-03:00');
  localDate.setHours(localDate.getHours() - time);

  return localDate.toISOString();
}
