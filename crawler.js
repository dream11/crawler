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

var cheerioReq = require('cheerio-req');
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
        cheerioReq(url, function(error, $) {
          if (error) {
            resolve(lowestStr);
          }
          $('a').each((index, item) => {
            const itemUrl = $(item).attr('href');
            if (!urlFragmentsMap[itemUrl]) {
              urlFragmentsMap[itemUrl] = itemUrl;
              urlFragments.push(itemUrl);
            }
          });

          $('.codes h1').each((index, item) => {
            lowestStr = extractLowestStr(lowestStr, $(item).text());
          });
          resolve(lowestStr);
        });
      });
    }

    function extractLowestStr(lowest, curr) {
      if (!lowest) {
        lowest = curr;
        extractLowestStr = (lowest, curr) => (lowest > curr ? curr : lowest);
        return lowest;
      }
      return lowest > curr ? curr : lowest;
    }

    (async url => {
      var toVisitFramgemts = [''];
      var toVisitFramgmentsMap = {};
      var resultStr;
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
