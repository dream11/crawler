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

    let tags = [url];
    const baseURL = url;
    let linkCount = 1;
    let resolvedCount = 0;
    const linksTouched = {};
    const linkRegex = /href="(.*?)"/g;
    const tagRegex = /<h1>(.*?)<\/h1>/g;

    const getBest = async (url) => {
      request(url, (error, response, body) => {
        if (error) {
          setTimeout(() => getBest(url), 10);
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