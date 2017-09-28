/**
 * Created by Sreedhar M B on 15/09/17.
 */

'use strict'

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let siteURL = "http://localhost:8080";

let linksMap = {};
let linksVisitedMap = {};
let strLexElem;
let siteVisitCount = 0;

const getSiteDetails = (nextSiteHash, resolveFunc, callback) => {
  let nextSite = siteURL + nextSiteHash;
  siteVisitCount++;
  request(nextSite, function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }

    // console.log(nextSite);
    // console.log("Status code: " + response.statusCode);
    let $ = cheerio.load(body);

    $('a.link').each(function( index ) {
      let linkElement = $(this).attr('href');
      if(!linksVisitedMap[linkElement]) {
        linksMap[linkElement] = linkElement;
      }
    });

    $('h1').each(function( index ) {
      let strElem = $(this).text().trim();
      strLexElem = strLexElem ? (strElem < strLexElem) ? strElem : strLexElem : strElem;
    });


    while(Object.keys(linksMap).length) {
      let nextPageHash = linksMap[Object.keys(linksMap)[0]];
      getSiteDetails(nextPageHash, resolveFunc, (strLexElem) => {
        // console.log(strLexElem);
        // console.log(siteVisitCount);
        siteVisitCount--;
        if(siteVisitCount == 1) {
          resolveFunc(strLexElem);
        }
      });
      linksVisitedMap[nextPageHash] = nextPageHash;
      delete linksMap[nextPageHash];
    }

    callback(strLexElem);
  });
};


/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    siteURL = url;
    getSiteDetails('', resolve, (strLexElem) => {
      // console.log(strLexElem);
    });


    // reject(new Error('NotImplemented'))
  });
