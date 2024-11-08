const Content = require('../utils/Content');
const Service = require('../utils/Service');
const Php = require('../utils/Php');

//Editar y publicar nota
//1 horas antes del partido

export const handler = async (event: any) => {
  // verificar lo que llega en evenet
  let con_id = `${event.con_id}`;

  try {
    if (con_id) {
      let info = await Service.getContenidoById(con_id);
      let content = await Content.modifyContent(info, event);

      let res = await Service.update(content, con_id);
      console.log('update contenido', res);

      ////////////// PUBLICAR CONTENIDO ///////////////////
      await Php.request(
        process.env.PUBLICATION_URL + con_id + '/' + event?.tournament?.mul_id
      );
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  return { message: 'End' };
};
