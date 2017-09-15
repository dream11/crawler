/**
 * Created by tushar on 13/09/17.
 */

'use strict'
const request = require('request');
const cheerio = require('cheerio');

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
const words = [];
const linkMap = {};
const links = [];
module.exports = url =>
  new Promise((resolve, reject) => {
    const crawl = async currentUrl => {
      request(currentUrl, (err, res, body) => {
        if(res && res.statusCode === 200) {
          let $ = cheerio.load(body);
          $('div.codes h1')
            .map((i, w) => w.firstChild.nodeValue)
            .toArray()
            .forEach(w => words.push(w));
          $('a.link')
            .map((i, l) => $(l).attr('href'))
            .toArray()
            .filter(l => !linkMap[l])
            .forEach(l => {
              links.push(l);
              linkMap[l] = true;
            });

          if(0 === links.length) {
            resolve(words.sort()[0]);
          } else {
            for(var i = 0; i <= links.length / 100; i++) {
              crawl(url + links.pop());
            }
          }
        } else if(err){
          reject(err);
        }
      });
    }
    crawl(url);
  })
