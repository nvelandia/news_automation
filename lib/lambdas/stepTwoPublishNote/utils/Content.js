'use strict';

const moment = require('moment-timezone');
const Service = require('./Service');

const Content = {
  async modifyContent(content, event) {
    let matchInfo = await Service.getMatchById(event.match_id);
    if (matchInfo) {
      let _Mam = JSON.parse(matchInfo.match_mam_json);
      let { homeTeamName, awayTeamName } = _Mam.match;

      const now = await this.getArgTime();
      const new_title = `Ver EN VIVO ${homeTeamName} vs. ${awayTeamName}: dónde seguir por TV y ONLINE en streaming`;

      content.con_titulo = new_title;
      content.con_titulo_preview = new_title;
      content.con_titulo_url = new_title;
      content.con_fecha_modificacion = now;
      content.con_meta_title = new_title;

      return content;
    }
  },
  getArgTime() {
    const argentinaTime = moment()
      .tz('America/Argentina/Buenos_Aires')
      .format('YYYY-MM-DD HH:mm:ss');
    return argentinaTime;
  },
};

module.exports = Content;
