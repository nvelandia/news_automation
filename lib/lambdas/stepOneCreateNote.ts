const Content = require('../utils/Content');
const Service = require('../utils/Service');
const Php = require('../utils/Php');

export const handler = async (event: any, context: any) => {
  //
  let matchInfo = await Service.getMatchById(event.match_id, 'df_match');
  const executionArn = context.invokedFunctionArn;

  try {
    if (matchInfo) {
      // Info del mam
      let _Mam = JSON.parse(matchInfo.match_mam_json);
      let info = await Content.createContent(_Mam, event);

      if (info) {
        // Inserto un nuevo contenido
        let con_id = await Service.insert('tad_contenido', info.content);
        console.log('Nuevo Contenido', con_id);

        info.article.con_id = con_id;
        event.con_id = con_id;

        console.log('info.article', info.article);
        let tad_nota = await Service.insert('tad_nota', info.article);
        console.log('tad_nota', tad_nota);

        for (const ter_id of info.terms) {
          let insertTerm = await Service.insertTerm(con_id, ter_id);
          console.log('insertTerm', insertTerm);
        }

        let df_match_prev = {
          match_id: event.match_id,
          con_id,
          executionArn,
        };

        let updateMatch = await Service.updateMatchPrev(df_match_prev);
        console.log('updateMatch', updateMatch);

        ////////////// PUBLICAR CONTENIDO ///////////////////
        await Php.request(
          process.env.PUBLICATION_URL + con_id + '_' + event?.tournament?.mul_id
        );
      } else {
        console.log('Error getMatchById');
      }
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  return event;
};
