/**
 * Created by Kshirodra, Sneha & Sampath on 16/09/17.
 */

'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
const request = require("request");

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

    let bestString = url;
    const baseURL = url;
    const links = [];
    let count = 0;
    const linksTouched = {};
    const linkRegex = /href="(.*?)"/g;
    const tagRegex = /<h1>(.*?)<\/h1>/g;

    const getBest = async (url) => {
      request(url, (error, response, body) => {
        if(error) {
           reject(error); return;
         }
        const linkList = getMatches(body, linkRegex).map(link => link.substr(0, 1) == '/' ? baseURL + link : link);
        const tags = getMatches(body, tagRegex).sort();

        if (!bestString || tags[0] < bestString)
          bestString = tags[0];

        linkList.forEach((link) => {
          if (!linksTouched[link]) {
            linksTouched[link] = true;
            links.push(link);
          }
        });

        count++;
        if (count == links.length) {
          resolve(bestString)
        } else {
          getBest(links[count]);
        }
      })
    }
    getBest(url);
  });
