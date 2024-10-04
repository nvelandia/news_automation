const Content = require('./utils/Content');
const Service = require('./utils/Service');

export const handler = async (event: any) => {
  console.log('lambda one', event);
  //Crear y publicar nota
  //24 horas antes del partido

  let matchInfo = await Service.getMatchById(event.match_id);

  console.log('matchInfo', matchInfo);

  if (matchInfo) {
    // Info del mam
    let _Mam = JSON.parse(matchInfo.match_mam_json);
    let info = await Content.createContent(_Mam, event);

    if (info) {
      // Inserto un nuevo contenido
      let con_id = await Service.insert('tad_contenido', info.content);
      console.log('Nuevo Contenido', con_id);

      info.article.con_id = con_id;

      console.log('info.article', info.article);
      let tad_nota = await Service.insert('tad_nota', info.article);
      console.log('tad_nota', tad_nota);

      for (const ter_id of info.terms) {
        let insertTerm = await Service.insertTerm(con_id, ter_id);
        console.log('insertTerm', insertTerm);
      }

      // info.match.con_id = con_id;
      // console.log('info.match', info.match);
      // let updateMatch = await Service.updateMatch(
      //   info.match,
      //   _Mam.match.matchId
      // );
      // console.log('updateMatch', updateMatch);

      ////////////// PUBLICAR CONTENIDO ///////////////////
      // await _Php.request(process.env.PUBLICATION_URL + con_id);
    } else {
      console.log('Error getMatchById');
    }
  }

  return event;
};

handler({
  match_id: 512614,
  match_start: '2024-10-04 20:00:00',
  waitTime1: '2024-10-04T18:00:00.000Z',
  waitTime2: '2024-10-04T19:00:00.000Z',
  tournament: {
    name: 'primeraa',
    text: 'Todos los partidos de la Liga Profesional de Fútbol de Argentina pueden verlo aquellos que tengan contratado el Pack Fútbol, con los canales ESPN Premium y TNT Sports, por TV o las distintas plataformas online de los cableoperadores.',
  },
});
