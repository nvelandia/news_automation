'use strict';

const moment = require('moment-timezone');
const Service = require('./Service');

const Content = {
  async getTemplate(mam, event) {
    let {
      homeTeamName,
      awayTeamName,
      scheduledStart,
      competition,
      sport,
      channel,
      matchId,
    } = mam.match;
    let stadium = mam?.venueInformation?.venue?.stadium?.stadiumName;

    // Creación del contenido --------------------------------------------
    let title = `${homeTeamName} vs. ${awayTeamName}, EN VIVO: dónde ver por TV y ONLINE`;
    let description = `Conocé las opciones para seguir en vivo, por televisión y a través de internet, el encuentro entre ${homeTeamName} y ${awayTeamName}, por ${competition}.`;
    let meta_title = title;
    let meta_description = description;

    const dayName = new Date(event.match_start.replace(' ', 'T'));
    const week = [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ];
    const day = week[dayName.getDay()];

    let first_paragraph = `<p>
    <b>${homeTeamName}</b> y <b>${awayTeamName}</b> se enfrentarán este ${day}, desde las ${scheduledStart}, por <b>${competition}</b>. El encuentro se disputará en el estadio ${stadium}. A continuación, conocé las opciones para <b>ver en vivo el encuentro por televisión y de manera online</b>.
    </p>`;

    let first_h2 = `<h2>${homeTeamName} vs. ${awayTeamName}, EN VIVO: dónde ver por TV y ONLINE</h2>`;
    let second_paragraph = Content.replaceStrings(event.tournament.text);
    // Mam del parttido
    let second_h2 = `<h2>A qué hora juegan ${homeTeamName} vs. ${awayTeamName}, país por país</h2>`;
    let third_paragraph = Content.getDates(event.match_start);

    let partOne = first_h2 + second_paragraph;
    let secondPart = second_h2 + third_paragraph;
    let thirdPart = `deportes.${sport}.${channel}.ficha.${matchId}`;

    let body = [];
    body[0] = await Content.getBodyItem(
      0,
      'texto',
      first_paragraph,
      null,
      null
    );
    body[1] = await Content.getBodyItem(1, 'texto', partOne, null, null);
    body[2] = await Content.getBodyItem(2, 'mam', null, null, thirdPart);
    body[3] = await Content.getBodyItem(3, 'texto', secondPart, null, null);

    const resp = {
      title: title,
      description: description,
      url_title: title,
      meta_title: meta_title,
      meta_description: meta_description,
      txtBody: first_paragraph + partOne + secondPart,
      body: body,
    };

    return resp;
  },
  async getBodyItem(index, type, data, incidences, mam) {
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

    if (mam) {
      itm.canal = mam;
    }

    return itm;
  },
  replaceStrings(text) {
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

    const stepInfo = await this.getTemplate(mam, event);

    let replace_var =
      '[{"field_name":"con_titulo","replace_var_name":"titulo"},{"field_name":"con_titulo_preview","replace_var_name":"titulo_preview"},{"field_name":"not_volanta","replace_var_name":"volanta"},{"field_name":"con_descripcion","replace_var_name":"bajada"},{"field_name":"not_interlinking","replace_var_name":"interlinking"},{"field_name":"not_cuerpo","replace_var_name":"cuerpo"},{"field_name":"iframe_html_1","replace_var_name":"iframe_html_1","value":""}]';

    const multimedia = await Service.getById(5739);
    let mul_imagen = '';
    if (multimedia) {
      mul_imagen = multimedia['mul_imagen'];
    }

    const visible = 0;
    const red_id = 'datafactory';

    const termLeague = await Service.getTermByLeague(mam.match.leagueId);
    const termHome = await Service.getTermByTeam(mam.match.homeTeamId);
    const termAway = await Service.getTermByTeam(mam.match.awayTeamId);
    const now = await Content.getArgTime();

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
        con_titulo_preview: stepInfo.title,
        con_titulo_url: stepInfo.url_title,
        con_descripcion: stepInfo.description,
        con_fecha_alta: now,
        con_fecha_modificacion: now,
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
        con_mams: '[]',
        con_story: 0,
      },
      article: {
        not_cuerpo: JSON.stringify(stepInfo.body),
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
  getDates(matchStartArgentina) {
    const countries = {
      Argentina: 'America/Argentina/Buenos_Aires',
      Bolivia: 'America/La_Paz',
      Brasil: 'America/Sao_Paulo',
      Chile: 'America/Santiago',
      Colombia: 'America/Bogota',
      Ecuador: 'America/Guayaquil',
      'Estados Unidos (Central)': 'America/Chicago',
      'Estados Unidos (Este)': 'America/New_York',
      'Estados Unidos (Montaña)': 'America/Denver',
      'Estados Unidos (Pacífico)': 'America/Los_Angeles',
      México: 'America/Mexico_City',
      Paraguay: 'America/Asuncion',
      Perú: 'America/Lima',
      Uruguay: 'America/Montevideo',
      Venezuela: 'America/Caracas',
    };

    // Convertir la fecha de inicio del partido a cada zona horaria
    const matchTimes = Object.entries(countries).map(([country, timezone]) => {
      const localTime = moment
        .tz(matchStartArgentina, 'America/Argentina/Buenos_Aires')
        .tz(timezone)
        .format('HH:mm');
      return `<li>${country}: ${localTime} horas</li>`;
    });

    // Devolver el HTML con los tiempos de cada país
    return `<ul>${matchTimes.join('')}</ul>`;
  },
  getArgTime() {
    const argentinaTime = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('YYYY-MM-DD HH:mm:ss');
    return argentinaTime;
  },
};

module.exports = Content;
