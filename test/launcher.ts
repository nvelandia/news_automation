// import { handler } from '../lib/lambdas/stepOneCreateNote/index';
import { handler } from '../lib/lambdas/stepTwoPublishNote';

handler({
  match_id: 475318,
  match_start: '2024-10-22 11:00:00',
  waitTime1: '2024-10-22T10:00:00.000Z',
  waitTime2: '2024-10-22T09:00:00.000Z',
  tournament: {
    name: 'primeraa',
    text: 'Todos los partidos de la Liga Profesional de Fútbol de Argentina pueden verlo aquellos que tengan contratado el Pack Fútbol, con los canales ESPN Premium y TNT Sports, por TV o las distintas plataformas online de los cableoperadores.',
  },
});
