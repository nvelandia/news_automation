exports.handler = async (event: any) => {
  console.log('lambda two received:', event);
  //Editar y publicar nota
  //1 horas antes del partido
  //End
  return { message: 'data from twoLambda' };
};
