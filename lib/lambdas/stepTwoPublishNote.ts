const Content = require('../utils/Content');
const Service = require('../utils/Service');
const Php = require('../utils/Php');

//Editar y publicar nota
//1 horas antes del partido

export const handler = async (event: any) => {
  console.log('Test lambda two:', event);

  // verificar lo que llega en evenet
  let con_id = event.con_id;

  if (con_id) {
    let info = await Service.getContenidoById(con_id);
    let content = await Content.modifyContent(info, event);

    let res = await Service.update(content, con_id);

    ////////////// PUBLICAR CONTENIDO ///////////////////
    await Php.request(process.env.PUBLICATION_URL + con_id);
  }

  return { message: 'End' };
};
