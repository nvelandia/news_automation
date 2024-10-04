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
      await Service.insert('tad_nota', info.article);

      for (const ter_id of info.terms) {
        await Service.insertTerm(con_id, ter_id);
      }

      info.match.con_id = con_id;
      await Service.updateMatch(info.match, _Mam.match.matchId);

      ////////////// PUBLICAR CONTENIDO ///////////////////
      // await _Php.request(process.env.PUBLICATION_URL + con_id);
    }
  }

  return event;
};

handler({
  match_id: 727365,
  tournament: {
    name: 'primeraa',
    text: 'Todos los partidos de la Liga Profesional de Fútbol de Argentina pueden verlo aquellos que tengan contratado el Pack Fútbol, con los canales ESPN Premium y TNT Sports, por TV o las distintas plataformas online de los cableoperadores.',
  },
});
