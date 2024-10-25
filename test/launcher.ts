import { handler } from '../lib/lambdas/stepOneCreateNote';
// import { handler } from '../lib/lambdas/stepTwoPublishNote';

handler({
  match_id: 475300,
  match_start: '2024-10-23 13:00:00',
  waitTime1: '2024-10-23T11:30:00.000Z',
  waitTime2: '2024-10-23T12:00:00.000Z',
  tournament: {
    name: 'primeraa',
    text: 'Todos los partidos de la Liga Profesional de Fútbol de Argentina pueden verlo aquellos que tengan contratado el Pack Fútbol, con los canales ESPN Premium y TNT Sports, por TV o las distintas plataformas online de los cableoperadores.',
  },
});
