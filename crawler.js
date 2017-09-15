/**
 * Created by tushar on 13/09/17.
 */

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

   var baseURL = url
   var linksCount = 0
   var resolvesCounts = 0
   var bestString = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
   var linksTouched = {}

   var getBest = function (url){
     linksCount++
     request(url, function(error, response, body) {
        if(error) {
        }
        else if(response.statusCode === 200) {
             var $ = cheerio.load(body);
             var h1 = $('h1');
             $(h1).each(function(i, link){
               if(bestString > $(link).text()){
                 bestString = $(link).text();
               }
             });

             var links = $('a');
             $(links).each(function(i, link){
               if(!linksTouched[$(link).attr('href')]){
                 linksTouched[$(link).attr('href')] = true
                 getBest(baseURL + $(link).attr('href'))
               }
             });
         }
         resolvesCounts++
         if(linksCount == resolvesCounts){
           resolve(bestString)
         }
     });
   }
   getBest(url)
})
