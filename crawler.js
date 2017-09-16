/**
 * Created by tushar on 13/09/17.
 */

'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
// const Cheerio = require('cheerio');
const request = require('request');

const CONCURRENCY = 1;

const getLinkRegex = () => /href="(\/[a-z,0-9]+)">/g;
const getCodeRegex = () => /<h1>([a-z]+)<\/h1>/g;

const getBody = url =>
  new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) return reject(error);
      if (response.statusCode !== 200) return reject(response.statusCode);
      if (!body) return reject(new Error('Empty response'));
      return resolve(body);
    });
  })

const toVdom = body => Cheerio.load(body);

const getCodes = async (url) => {
  let body = await getBody(url);
  let codes = [], links = [];
  let linkRegex = getLinkRegex();
  let codeRegex = getCodeRegex();
  let regexLinkOutput, regexCodeOutput;
  while (regexLinkOutput = linkRegex.exec(body)) {
    links.push(regexLinkOutput[1]);
  }
  while (regexCodeOutput = codeRegex.exec(body)) {
    codes.push(regexCodeOutput[1]);
  }
  // let $ = toVdom(body);
  // let codes = $('h1').map((i, el) => $(el).text()).toArray();
  // let links = $('a').map((i, el) => $(el).attr('href')).toArray();
  return { codes, links };
}


const MultipleGetContent = async (links) => {
  return Promise.all(links.map((link) => getCodes(link)))
    .then((results) => {
      let codes = [], links = [];
      for (let ob of results) {
        codes = codes.concat(ob.codes);
        links = links.concat(ob.links);
      }
      return { codes, links }
    });
}

const crawl = async (url) => {
  let allCodes = new Set();
  let visitedLinks = new Set();
  let linksToVisit = [];

  const { codes, links } = await getCodes(url);
  codes.forEach((code) => allCodes.add(code));

  linksToVisit = linksToVisit.concat(links.map((link) => url + link));
  let iter = (done) => {
    if (linksToVisit.length) {
      // console.log(allCodes.size, ' -working....', visitedLinks.size, ' with ', linksToVisit.length);
      let linkToProcess = linksToVisit.pop();
      visitedLinks.add(linkToProcess);
      getCodes(linkToProcess).then((results) => {
        results.codes.forEach((code) => allCodes.add(code));
        for (let link of results.links.map((link) => url + link)) {
          //SKIP case already available in linksToVisit or already visited.
          if (linksToVisit.indexOf(link) !== -1 || visitedLinks.has(link)) continue;
          linksToVisit.push(link);
        }
        iter(done);
      });
      // MultipleGetContent(linksToVisit.slice(0, CONCURRENCY)).then((results) => {
      //   results.codes.forEach((code) => allCodes.add(code));
      //   linksToVisit.splice(0, CONCURRENCY).forEach((link) => visitedLinks.add(link));
      //   for (let link of results.links.map((link) => url + link)) {
      //     //SKIP case already available in linksToVisit or already visited.
      //     if (linksToVisit.indexOf(link) !== -1 || visitedLinks.has(link)) continue;
      //     linksToVisit.push(link);
      //   }
      //   iter(done);
      // }).catch((ex) => {
      //   console.log(ex);
      // });
      return;
    }
    done();
  }

  return new Promise((resolve, reject) => {
    iter(() => {
      resolve(Array.from(allCodes).sort()[0]);
    });
  })

};


module.exports = url => crawl(url);
