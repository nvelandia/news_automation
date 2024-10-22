'use strict';
const AWS = require('aws-sdk');

const s3Object = new AWS.S3();

const S3 = {
  async getFileContent(bucket, key, encoding = null) {
    return await new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key,
      };

      s3Object.getObject(params, (err, result) => {
        if (err) {
          reject(false);
        } else {
          let contents = '';
          if (encoding != null) {
            contents = result.Body.toString(encoding);
          } else {
            contents = result.Body.toString();
          }

          resolve(contents);
        }
      });
    });
  },
  async getFileHead(bucket, key) {
    return await new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key,
      };

      s3Object.getObject(params, (err, response) => {
        if (err) {
          reject(false);
        } else {
          resolve(response);
        }
      });
    });
  },
};

// 'use strict';
// const http = require('http');
// const URL = require('url');

// const PHP = {
//     async request(url) {
//         return new Promise((resolve, reject) => {
//             let req = http.request(URL.parse(url))
//                 //req.write(data);
//             req.end(null, null, () => {
//                 resolve(req);
//             })
//         })
//     }
// };

// module.exports = PHP;

const getS3Info = async (event) => {
  const object = event.Records[0].s3;
  const bucket = object.bucket.name;
  const key = object.object.key;

  const fileHead = await S3.getFileHead(bucket, key);
  const fileContent = await S3.getFileContent(bucket, key);

  if (fileHead && fileContent) {
    try {
      // Formato entregado por S3 -> 2021-10-19T17:53:58.000Z
      const lm = new Date(fileHead.LastModified);
      const gmt = 180 * 60 * 1000;
      const utc_ts = lm.getTime() - gmt;
      const fecha = new Date(utc_ts);
      const lastModified =
        fecha.toISOString().split('T')[0] +
        ' ' +
        fecha.toTimeString().split(' ')[0]; //Last modified date

      const json = JSON.parse(fileContent);

      if (json.match.scheduledStart == ':') {
        // El partido no tiene fecha de inicio definida. Salgo de la función!
        console.log('Mam sin fecha de inicio definida:', key);
        return false;
      }

      const id = json.match.matchId;
      const channel = json.match.channel;
      const sport = json.match.sport;
      const status = json.status.value;

      // Inicio de partido
      const hm = json.match.scheduledStart.split(':');
      const start_dt = new Date(
        json.match.date.substr(0, 4),
        json.match.date.substr(4, 2) - 1,
        json.match.date.substr(6, 2),
        hm[0],
        hm[1],
        0
      );
      const scheduledStart =
        start_dt.toISOString().split('T')[0] +
        ' ' +
        start_dt.toTimeString().split(' ')[0];

      const response = {
        match_id: id,
        match_start: scheduledStart,
        match_mam_file: key,
        match_mam_json: fileContent,
        match_mam_last_mod: lastModified,
        match_channel: channel,
        match_sport: sport,
        match_last_incidence: 0,
        match_status: status,
      };

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
};

module.exports = {
  getS3Info,
  S3,
};
