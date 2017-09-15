'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

var request = require('request');
var cheerio = require('cheerio');

module.exports = url =>
  new Promise((resolve, reject) => {

    var domain = url
    var myArray = []
    var pagesVisited = {}
    var pagesArray = []
    var responseNumber = 0
    var callsNumber = 0
    var lastCalled = 0

    var findWord = async function (url) {
      callsNumber++
      request(url, function (error, response, body) {
        if(error) {
          // Do Nothing
        }
        if(response && response.statusCode === 200) {
          var $ = cheerio.load(body);
          var headingElements = $('h1');
          $(headingElements).each(function (i, elem) {
            myArray.push($(elem).text());
          });

          var links = $('.link');
          $(links).each(function (i, elem) {
            var myElement = $(elem).attr('href');
            if (!pagesVisited[myElement]) {
              pagesVisited[myElement] = true;
              pagesArray.push(myElement);
              lastCalled++;
              findWord(domain + myElement)
            }
            if(callsNumber-responseNumber>10) {
              var oneMoreThanLastCalled = lastCalled+1;
              if(pagesArray[oneMoreThanLastCalled]) {
                lastCalled++
                findWord(domain + pagesArray[oneMoreThanLastCalled])
              }
              var twoMoreThanLastCalled = lastCalled+1;
              if(pagesArray[oneMoreThanLastCalled]) {
                lastCalled++
                findWord(domain + pagesArray[oneMoreThanLastCalled])
              }
              var threeMoreThanLastCalled = lastCalled+1;
              if(pagesArray[oneMoreThanLastCalled]) {
                lastCalled++
                findWord(domain + pagesArray[oneMoreThanLastCalled])
              }
            }
          });
        }
        responseNumber++;
        setTimeout(function() {
          if ((lastCalled+1) === callsNumber && callsNumber === responseNumber) {
            resolve(myArray.sort()[0]);
          }
        },500);
      });
    }
    findWord(url)
  })