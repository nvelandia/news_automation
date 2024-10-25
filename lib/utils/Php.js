'use strict';
const http = require('http');
const URL = require('url');

const PHP = {
  async request(url) {
    return new Promise((resolve, reject) => {
      let req = http.request(URL.parse(url));
      //req.write(data);
      req.end(null, null, () => {
        resolve(req);
      });
    });
  },
};

module.exports = PHP;
