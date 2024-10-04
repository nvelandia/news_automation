'use strict';

// const mysql = require('mysql2/promise');
const mysql = require('mysql');
const Service = require('./Service');

const Content = {
  async getTemplate(mam, event) {
    let { homeTeamName, awayTeamName, scheduledStart, competition } = mam.match;

    // Creación del contenido --------------------------------------------
    let title = `${homeTeamName} vs. ${awayTeamName}, EN VIVO: dónde ver por TV y ONLINE`;
    let description = `Conocé las opciones para seguir en vivo, por televisión y a través de internet, el encuentro entre ${homeTeamName} y ${awayTeamName}, por ${competition}.`;
    let meta_title = title;
    let meta_description = description;

    let first_paragraph = `<p>
    <b>${homeTeamName}</b> y <b>${awayTeamName}</b> se enfrentarán este (fecha completa), desde las (hora argentina), por <b>${competition}</b>. El encuentro se disputará en (Estadio). A continuación, conocé las opciones para <b>ver en vivo el encuentro por televisión y de manera online</b>.
    </p>`;

    let first_h2 = `<h2>${homeTeamName} vs. ${awayTeamName}, EN VIVO: dónde ver por TV y ONLINE</h2>`;
    let second_paragraph = replaceStrings(event.tournament.text);
    // Mam del parttido
    let second_h2 = `<h2>A qué hora juegan ${homeTeamName} vs. ${awayTeamName}, país por país</h2>`;
    let third_paragraph = '';

    // Argentina: X horas
    // Bolivia: X horas
    // Brasil: X horas
    // Chile: X horas
    // Colombia: X horas
    // Ecuador: X horas
    // Estados Unidos (Central): X horas
    // Estados Unidos (Este): X horas
    // Estados Unidos (Montaña): X horas
    // Estados Unidos (Pacífico): X horas
    // México: X horas
    // Paraguay: X horas
    // Perú: X horas
    // México: X horas
    // Uruguay: X horas
    // Venezuela: X horas

    let txtBody =
      first_paragraph +
      first_h2 +
      second_paragraph +
      second_h2 +
      third_paragraph;

    //  --------------------------------------------

    const resp = {
      title: title,
      description: description,
      url_title: url_title,
      meta_title: meta_title,
      meta_description: meta_description,
      txtBody: txtBody,
    };

    return resp;
  },
  // async getById(matchId) {
  //   let connection;
  //   try {
  //     connection = await mysql.createConnection({
  //       host: process.env.MYSQL_HOST,
  //       user: process.env.MYSQL_USER,
  //       password: process.env.MYSQL_PASSWORD,
  //       database: process.env.MYSQL_DATABASE,
  //     });

  //     const sql = `SELECT * FROM df_match WHERE match_id = ?`;
  //     const [rows] = await connection.execute(sql, [matchId]);

  //     if (rows.length > 0) {
  //       return rows[0];
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     // Manejar errores
  //     return {
  //       statusCode: 500,
  //       body: JSON.stringify({
  //         message: 'Error al insertar datos',
  //         error: error.message,
  //       }),
  //     };
  //   } finally {
  //     if (connection) {
  //       // Cerrar conexión
  //       await connection.end();
  //     }
  //   }
  // },
  async getBodyItem(index, type, data, incidences) {
    var itm = {
      indice: index,
      tipo: type,
    };

    if (data) {
      itm.texto = data;
    }

    if (incidences) {
      itm.incidences = incidences;
    }

    return itm;
  },
  async replaceStrings(text) {
    const channels = [
      'TNT Sports',
      'Amazon Prime Video',
      'SporTV',
      'Premiere',
      'Rede Globo',
      'ViX Premium',
      'TUDN',
      'Caliente TV',
      'Azteca 7',
      'Disney+ Premium',
      'VTV+',
      'Tigo Sports',
      'Tigo Sports+',
      'DIRECTV',
      'Liga 1 Play',
      'Liga 1 Max',
      'Fanatiz International',
      'Zapping',
      'Win Sports',
      'Win Sports+',
      'Liga FUTVE',
      'ESPN',
      'Fox Sports',
      'Apple TV',
      'Telefe',
      'TyC Sports',
    ];

    channels.forEach((word) => {
      const regex = new RegExp(word, 'g');
      text = text.replace(regex, `<b>${word}</b>`);
    });

    return `<p>${text}</p>`;
  },
  async createContent(mam, event) {
    const sport = mam.match.sport;
    let channel = mam.match.channel;

    const stepInfo = await getTemplate(mam, event);

    let replace_var =
      '[{"field_name":"con_titulo","replace_var_name":"titulo"},{"field_name":"con_titulo_preview","replace_var_name":"titulo_preview"},{"field_name":"not_volanta","replace_var_name":"volanta"},{"field_name":"con_descripcion","replace_var_name":"bajada"},{"field_name":"not_interlinking","replace_var_name":"interlinking"},{"field_name":"not_cuerpo","replace_var_name":"cuerpo"},{"field_name":"iframe_html_1","replace_var_name":"iframe_html_1","value":""}]';

    // const mul_id = await _Multimedia.getMulIdSportImage(1);
    // const multimedia = await _Multimedia.getById(mul_id);
    let mul_imagen = '';
    // if (multimedia) {
    //   mul_imagen = multimedia['mul_imagen'];
    // }

    const visible = 0;
    const red_id = 'datafactory';

    let body = [];

    // if (article != null) {
    //   let articleBody = JSON.parse(article.not_cuerpo);
    //   if (articleBody[0].texto == matchRecord.match_na_text) {
    //     // Actualizo el cuerpo de la nota (Solo si no fue editado por contenidos)
    //     body[0] = await _Article.getBodyItem(
    //       0,
    //       'texto',
    //       stepInfo.txtBody,
    //       null
    //     );
    //   } else {
    //     articleBody.forEach((eBody) => {
    //       if (eBody.tipo != 'live-blog-posting') {
    //         body.push(eBody);
    //       }
    //     });
    //   }
    // } else {
    //   body[0] = await _Article.getBodyItem(0, 'texto', stepInfo.txtBody, null);
    // }

    body[0] = await _Article.getBodyItem(0, 'texto', stepInfo.txtBody, null);

    const termLeague = await Service.getTermByLeague(mam.match.leagueId);
    const termHome = await Service.getTermByTeam(mam.match.homeTeamId);
    const termAway = await Service.getTermByTeam(mam.match.awayTeamId);

    let terms = [];

    if (termLeague) terms.push(termLeague);
    if (termHome) terms.push(termHome);
    if (termAway) terms.push(termAway);

    let defaultTerm = 7020;
    if (terms.length == 0) {
      terms.push(defaultTerm);
    }

    const resp = {
      content: {
        cti_id: 'nota',
        vis_id: null,
        pag_id: 4738,
        con_titulo: stepInfo.title,
        con_titulo_preview: stepInfo.url_title,
        con_descripcion: stepInfo.description,
        con_fecha_alta: _Date.now(-3, 'YYYY-MM-DD hh:mm:ss'),
        con_fecha_modificacion: _Date.now(-3, 'YYYY-MM-DD hh:mm:ss'),
        con_imagen: mul_imagen,
        con_json: null,
        con_publicado: 0,
        con_replace_var: replace_var,
        fco_id: 'default',
        con_tema: terms[0],
        con_visible: visible,
        con_segmento: termLeague ? termLeague : defaultTerm, // Seteo el torneo como segmento. En caso de no existir el termino del torneo el default es 7020 -> Competencias y deportes
        con_meta_title: stepInfo.meta_title,
        con_meta_description: stepInfo.meta_description,
        red_id: red_id,
        con_mams: `["deportes.${sport}.${channel}.ficha.${mam.match.matchId}"]`,
        con_story: 0,
      },
      article: {
        not_cuerpo: JSON.stringify(body),
      },
      terms: terms,
      match: {
        match_publish: 0,
        match_na_text: stepInfo.txtBody,
        match_title: stepInfo.title,
        match_preview_title: stepInfo.title,
        match_meta_title: stepInfo.meta_title,
        match_description: stepInfo.description,
        match_meta_description: stepInfo.meta_description,
      },
    };

    return resp;
  },
};

module.exports = Content;

function test_db() {
  const connection = mysql.createConnection({
    host: '3.83.172.156', // Cambia 'localhost' si tienes una IP diferente o puerto personalizado
    user: 'root', // Tu usuario de MySQL
    password: '!hundido!', // Contraseña de MySQL
    database: 'bd_cms', // El nombre de la base de datos a la que te quieres conectar
    port: 3306, // Puerto de MySQL (generalmente 3306)
  });

  // Conectar a MySQL
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
  });

  // Hacer una consulta de prueba
  connection.query(
    'SELECT * FROM tad_contenido LIMIT 1 ',
    (err, results, fields) => {
      if (err) throw err;

      // Mostrar resultados
      console.log('Data received from database:');
      console.log(results);
    }
  );

  // Cerrar la conexión
  connection.end();
}

// test_db();
