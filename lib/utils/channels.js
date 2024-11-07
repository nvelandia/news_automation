'use strict';

const tournament = [
  {
    name: 'brasileirao',
    mul_id: 784691,
    text: `El partido se podrá seguir en Brasil a través de los siguientes canales de Amazon Prime Video, SporTV, Premiere y Rede Globo.

En Argentina no hay manera de verlo en directo, aunque como de costumbre, también vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.

`,
  },
  {
    name: 'mexico',
    mul_id: 784703,
    text: `El partido se podrá seguir en México y Estados Unidos a través de ViX Premium. Además, algunos partidos de la Liga MX son transmitidos por TUDN, Caliente TV y Azteca 7, entre otros.

En la Argentina, Disney+ Premium transmite un partido de la Liga MX por fecha. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'uruguay',
    mul_id: 784716,
    text: `El partido se podrá seguir en Uruguay a través de VTV+ y Disney+ Premium, que también transmite los partidos de la Primera División charrúa en Argentina. 

También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'chile',
    mul_id: 784695,
    text: `El partido se podrá seguir en Chile a través de TNT Sports Premium. En Argentina no hay manera de verlo en directo. 

También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'paraguay',
    mul_id: 784708,
    text: `El partido se podrá seguir en Paraguay a través de Tigo Sports o Tigo Sports+ y su aplicación. En Argentina se puede acceder mediante uno de los paquetes premium que ofrece DIRECTV. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'bolivia',
    mul_id: 784690,
    text: `El partido se podrá seguir en Bolivia a través de Tigo Sports Bolivia. En Argentina se puede acceder mediante uno de los paquetes premium que ofrece DIRECTV. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'peru',
    mul_id: 784709,
    text: `El partido se podrá seguir en Perú a través de Liga 1 Play o Liga 1 Max. En la Argentina, se puede contratar el servicio Fanatiz International. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'ecuador',
    mul_id: 784697,
    text: `El partido se podrá seguir en Ecuador a través de Zapping. En la Argentina, se puede contratar el servicio Fanatiz International. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'colombia',
    mul_id: 784696,
    text: `El partido se podrá seguir en Colombia a través de Win Sports o Win Sports+. En la Argentina, se puede contratar el servicio Fanatiz International. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'venezuela',
    mul_id: 784717,
    text: `El partido por la Liga FUTVE de Venezuela se podrá seguir gratis en todo el mundo a través del canal de YouTube Liga FUTVE. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'espana',
    mul_id: 784700,
    text: `Los partidos de LaLiga de España son transmitidos en Argentina entre Disney+ Premium, las distintas señales de ESPN y DIRECTV Sports. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'alemania',
    mul_id: 784692,
    text: `Todos los partidos de la Bundesliga de Alemania son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'italia',
    mul_id: 784714,
    text: `Todos los partidos de la Serie A de Italia son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.
`,
  },
  {
    name: 'premiereleague',
    mul_id: 784711,
    text: `Todos los partidos de la Premier League de Inglaterra son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com
`,
  },
  {
    name: 'francia',
    mul_id: 784704,
    text: `Todos los partidos de la Ligue 1 de Francia son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'champions',
    mul_id: 784693,
    text: `Todos los partidos de la UEFA Champions League son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN y Fox Sports. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'uefa',
    mul_id: 784699,
    text: `Todos los partidos de la UEFA Europa League son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN y Fox Sports. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'mls',
    mul_id: 784707,
    text: `Los partidos de la MLS de Estados Unidos se pueden seguir en todo el mundo a través de Apple TV, para quienes tengan contratado el MLS Season Pass. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'libertadores',
    mul_id: 784701,
    text: `Todos los partidos de la Copa CONMEBOL Libertadores son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de Fox Sports y Telefe. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'sudamericana',
    mul_id: 784715,
    text: `La mayoría de los partidos de la Copa CONMEBOL Sudamericana son transmitidos en Argentina por ESPN y Disney+ Premium, a excepción de algunos exclusivos de DIRECTV Sports. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
  {
    name: 'primeraa',
    mul_id: 784705,
    text: `Todos los partidos de la Liga Profesional de Fútbol de Argentina pueden verlo aquellos que tengan contratado el Pack Fútbol, con los canales ESPN Premium y TNT Sports, por TV o las distintas plataformas online de los cableoperadores.`,
  },
  {
    name: 'nacionalb',
    mul_id: 784712,
    text: `El partido se podrá seguir en vivo en la Argentina a través de la pantalla de TyC Sports. Para verlo online tenés que acceder a TyC Sports Play haciendo clic en play.tycsports.com. Si aún no lo hiciste, debés registrarte de manera gratuita en simples pasos y luego asentar la cuenta de tu cableoperador. ¡Muy fácil!`,
  },
  {
    name: 'eliminatorias',
    mul_id: 784698,
    text: `Todos los partidos de las Eliminatorias UEFA rumbo al Mundial 2026 son transmitidos en Argentina por Disney+ Premium. Algunos, además, se pueden ver en las distintas señales de ESPN. También vas a poder seguir el minuto a minuto del encuentro en el sitio web www.tycsports.com.`,
  },
];

module.exports = {
  tournament,
};

//  Primera nacional 784713 mul_id
