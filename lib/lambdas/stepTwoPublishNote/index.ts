const Service = require('./utils/Service');
const Content = require('./utils/Content');

//Editar y publicar nota
//1 horas antes del partido

export const handler = async (event: any) => {
  console.log('lambda two received:', event);

  // verificar lo que llega en evenet
  // let con_id = event.con_id;
  let con_id = 431776;

  if (con_id) {
    let info = await Service.getContenidoById(con_id);
    let content = await Content.modifyContent(info, event);

    let res = await Service.update(content, con_id);

    ////////////// PUBLICAR CONTENIDO ///////////////////
    // await _Php.request(process.env.PUBLICATION_URL + con_id);
  }

  return { message: 'End' };
};
