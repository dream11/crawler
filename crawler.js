/**
 * Author: Vijay Soni (vs4vijay@gmail.com)
 */
'use strict'

const axios = require('axios'),
      cheerio = require('cheerio'),
      URL = require('url');
// import axios from 'axios';

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
};

const delays = [444,222,555,111,333];
let visitedLinks = [];

async function getData(url) {

  if(visitedLinks.indexOf(url) !== -1) {
    return [];
  };

  // if(visitedLinks.length === 5) {
  //   return [];
  // }

  visitedLinks.push(url);
  const response = await axios.get(url).catch(err => console.log('err', err));

  if(response) {
    const rawHtml = response.data;
    const $ = cheerio.load(rawHtml);
    // console.log('rawHtml', rawHtml);

    let strings = $('.container .row .col .codes h1').map((i, el) => $(el).text()).get();
    let links = $('.container .row .col .link').map((i, el) => $(el).attr('href')).get();

    // console.log('strings', strings);
    // console.log('links', links);
    // console.log('visitedLinks:', visitedLinks.length);

    if(links && links.length > 0) {
      // strings = strings.concat(links.map(async link => await getData(config.url + link)));

      for(let link of links) {
        const host = `http://${URL.parse(url).host}`;
        const childStrings = await getData(host + link);
        strings = strings.concat(childStrings);
      }
    }
    return strings;
  } else {
    return [];
  }
};

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
async function crawl(url) {
  visitedLinks = [];

  let crawledStrings = await getData(url).catch(err => console.log(err));
  // console.log('crawledStrings', crawledStrings);

  const result = crawledStrings.sort()[0];
  console.log('result', result);
  return result;
};

// crawl(config.url);

module.exports = crawl;
