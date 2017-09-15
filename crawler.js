/**
 * Author: Vijay Soni (vs4vijay@gmail.com)
 */
'use strict'

const axios = require('axios'),
      cheerio = require('cheerio');
// import axios from 'axios';

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
};

const config = {
  url: 'http://localhost:8080',
  delays: [444,222,555,111,333]
};

const visitedLinks = [];

async function getData(url) {

  if(visitedLinks.indexOf(url) !== -1) {
    return [];
  };

  // if(visitedLinks.length === 5) {
  //   return [];
  // }

  visitedLinks.push(url);
  const response = await axios.get(url).catch(err => false);

  if(response) {
    const rawHtml = response.data;
    const $ = cheerio.load(rawHtml);

    // console.log('rawHtml', rawHtml);

    let strings = $('.container .row .col .codes h1').map((i, el) => $(el).text()).get();
    console.log('strings', strings);


    let links = $('.container .row .col .link').map((i, el) => $(el).attr('href')).get();
    console.log('links', links);
    console.log('visitedLinks:', visitedLinks.length);

    if(links && links.length > 0) {
      strings = strings.concat(links.map(link => getData(config.url + link)));
      // strings = strings.concat(await getData(config.url + links[2]));
    }
    // console.log('strings', strings);
    return strings;
  } else {
    return [];
  }
};

async function crawl() {
  // c752cf2206b29a988c866d2a21cb2cf0
  let crawledStrings = await getData('http://localhost:8080');
  console.log('crawledStrings', crawledStrings);

  const result = crawledStrings;
  console.log('result', result);
  return result;
};

crawl();

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = crawl;
