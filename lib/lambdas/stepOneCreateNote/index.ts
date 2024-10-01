exports.handler = async (event: any) => {
  console.log('lambda one', event);
  //Crear y publicar nota
  //24 horas antes del partido
  return {
    waitTime1: 10,
    waitTime2: 5,
  };
};
