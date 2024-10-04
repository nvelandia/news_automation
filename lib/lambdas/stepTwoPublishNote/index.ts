exports.handler = async (event: any) => {
  console.log('lambda two received:', event);
  //Editar y publicar nota
  //1 horas antes del partido
  //End
  return { message: 'data from twoLambda' };
};

// title = `Ver EN VIVO ${mam.match.homeTeamName} vs. ${mam.match.awayTeamName}: dónde seguir por TV y ONLINE en streaming`;

// con_id = matchRecord.con_id;
// if (con_id) {
//     content = await _Content.getById(matchRecord.con_id);
//     article = await _Article.getById(matchRecord.con_id);
// }
