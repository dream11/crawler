/**
 * Created by tushar on 13/09/17.
 */

'use strict';

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

// Solution by Abhishek<abhiisheek@hotmail.com> & Nanda Kishore<nandakishorenw@gmail.com>

// var cheerioReq = require('cheerio-req');
var request = require('request');
module.exports = url =>
  new Promise((resolve, reject) => {
    /**
     * TODO: Write your high performance code here.
     */
    function getLowestStringFromURL(
      url,
      urlFragments,
      urlFragmentsMap,
      lowestStr
    ) {
      return new Promise(function(resolve, reject) {
        request(url, function(error, respone, html) {
          if (error) {
            resolve(lowestStr);
          }

          const h1Tags = html.match(/<h1>(.*?)<\/h1>/g);
          h1Tags &&
            h1Tags.forEach(thisTag => {
              const text = thisTag.slice(4, thisTag.indexOf('</'));
              if (lowestStr > text) {
                lowestStr = text;
              }
            });

          const aTags = html.match(/href="(.*?)"/g);
          aTags &&
            aTags.forEach((el, i) => {
              if (i === 0) {
                return;
              }
              const link = el.slice(6, -1);
              if (!urlFragmentsMap[link]) {
                urlFragmentsMap[link] = link;
                urlFragments.push(link);
              }
            });
          resolve(lowestStr);
        });
      });
    }

    (async url => {
      var toVisitFramgemts = [''];
      var toVisitFramgmentsMap = {};
      var resultStr = 'zzzzzzzzzzzzzzzzzz';
      for (let i = 0; i < toVisitFramgemts.length; i++) {
        resultStr = await getLowestStringFromURL(
          url + toVisitFramgemts[i],
          toVisitFramgemts,
          toVisitFramgmentsMap,
          resultStr
        );
      }
      resolve(resultStr);
    })(url);
  });
