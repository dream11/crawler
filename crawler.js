/**
 * Created by tushar on 13/09/17.
 */

'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

var Crawler = require("crawler");

module.exports = url =>
 new Promise((resolve, reject) => {

   var baseURL = url
   var bestString = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
   var linksTouched = {}

   var c = new Crawler({
      maxConnections: 70,
      retryTimeout: 1000,
      retries: 10,
      callback: (error, res, done) => {
        if (error) {
          return;
        } else {
          var $ = res.$;
          var h1 = $('h1');
          $(h1).each(function(i, link){
            if(bestString > $(link).text()){
              bestString = $(link).text();
            }
          });

          var links = $('a');
          $(links).each(function(i, link){
            if(!linksTouched[$(link).attr('href')]){
              c.queue(baseURL + $(link).attr('href'))
              linksTouched[$(link).attr('href')] = true
            }
          });
        }
        done();
      },
    });
    c.queue(url);
    c.on("drain", () => {
      resolve(bestString);
    });
  });
