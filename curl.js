'use strict'

const exec = require('child_process').exec;

/**
 * Curls a website using a start {url}.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    exec('curl ' + url, (error, stdout) => {
      if (error !== null) {
          reject(error);
      } else {
        resolve(stdout);
      }
    });
  });