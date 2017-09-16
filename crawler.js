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
        if(err) {
          reject(err);
        }
        if(res && 200 === res.statusCode) {
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
            resolve(words
              .reduce((smallest, current) => 
                current < smallest ? current : smallest, 
              words[0]));
          } else {
            if(15 < links.length && 500 > links.length) {
              crawl(url + links.pop());
            }
            crawl(url + links.pop());
          }
        } else if(err){
          reject(err);
        }
      });
    }
    crawl(url);
  })
