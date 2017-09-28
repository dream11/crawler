/**
 * Created by Sneha on 16/09/17.
 */

'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

const request = require("request");
var http = require('http');
var httpAgent = new http.Agent({keepAlive:true, keepAliveMsecs:30000, maxSockets: 50});

const getMatches = (str, regex) => {
  let m = [];
  const matches = [];
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1)
        matches.push(match);
    });
  }
  return matches;
}

module.exports = url =>
  new Promise((resolve, reject) => {

    let start = new Date();
    let tags = [];
    const baseURL = url;
    let linkCount = 1;
    let resolvedCount = 0;
    const linksTouched = {};
    const linkRegex = /href="(.*?)"/g;
    const tagRegex = /<h1>(.*?)<\/h1>/g;

    const getBest = async (url) => {
      request({url, pool: httpAgent}, (error, response, body) => {
        
        if(error || (response && response.statusCode != 200)) {
          console.log('error '+error)
          getBest(url);
          return;
        }
        resolvedCount++;
        const linkList = getMatches(body, linkRegex).map(link => link.substr(0, 1) == '/' ? baseURL + link : link);
        tags.push(getMatches(body, tagRegex).sort()[0]);

        linkList.forEach((link) => {
          if (!linksTouched[link]) {
            linksTouched[link] = true;
            linkCount++;
            getBest(link);
          }
        });

        if (resolvedCount == linkCount) {
          resolve(tags.sort()[0])
        }
      })
    }
    getBest(url);
  });
