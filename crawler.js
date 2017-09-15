/**
 * Created by tushar on 13/09/17.
 */

'use strict'

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    /**
     * TODO: Write your high performance code here.
     * 
     */

    var Crawler = require("js-crawler");
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    
    
   var crawler = new Crawler().configure({ignoreRelative: false, depth: 1001});
  var resultString='zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
   crawler.crawl({
     url: url,
     success: function(page) {
      //  console.log(page.url);
      // console.log('############' + resultString);
       var values = page.body.match(/(<h1>)(.+?)(<\/h1>)/g)
       values.forEach(function(v) {
         var x = v.split('>')[1].split('<')[0];
        //  console.log(x);
         if(resultString > x){
           resultString = x;
          //  console.log("updating smallest string : " + x);
         }
       });
     },
     failure: function(page) {
       console.log(page.status);
     },
     finished: function(crawledUrls) {
       console.log(crawledUrls);
       console.log("Result is : " + resultString);
       resolve(resultString);
     }
   });


    // reject(new Error('NotImplemented'))
  })
