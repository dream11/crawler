/**
 * Created by tushar on 13/09/17.
 */

'use strict'
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

var cheerioReq = require('cheerio-req');
var _ = require('underscore');

module.exports = url =>
  new Promise((resolve, reject) => {    
    function getURLsAndText(url) {
      var quote;
      return new Promise(function(resolve, reject) {
        cheerioReq(url, function(error, $) {      
          let strings = [];
          let links = [];
          let h1Tags = $('h1');
          let aTags = $('a');
          let i;
          let j;
          for(i = 0; i<aTags.length; i++) {
            links[i] = $(aTags[i]).attr('href');
          }
          for(j = 0; j<h1Tags.length; j++) {          
            strings.push($(h1Tags[j]).text());
          }   
          console.log(links, strings);
          resolve({links, strings});
        });
      });
    }     
    async function crawlMe(url) {
      var urlsToVisit = [""]; // Initially crawl the base url. So to pass the for loop start with an empty string.
      var strings = [];
      var baseUrl = url;
      for(let i=0; i<urlsToVisit.length; i++) {
        console.log(i);
        var response = await getURLsAndText(baseUrl + urlsToVisit[i]);
        console.log(response.links.length);
        response.links.forEach((link) => {
            if(urlsToVisit.indexOf(link) < 0) {
                urlsToVisit.push(link);
            }
        });
        strings = [...strings, ...response.strings];
      }      
      resolve(strings.sort()[0]);
    }     
    crawlMe(url);    
})
