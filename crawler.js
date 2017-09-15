/**
 * Created by Rajat on 15/09/17.
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
 	var array = []
	var linkArray = [];
	var visitedLink = {}
	var count = 0
	var arrayObj = {}
	var baseUrl = url
  	var getLexigraphy = function(data){
  		resolve(data.sort()[0])
  	}


  	var crawl = function  (url){
	request(url, function(error, response, body) {
	   if(error) {
	     console.log("Error: " + error);
	   }
	   // Check status code (200 is HTTP OK)
	   //console.log("Status code: " + response.statusCode);
	   if(response.statusCode === 200) {
	     // Parse the document body
	      var $ = cheerio.load(body);
	    
	      var h1 = $('h1'); //jquery get all hyperlinks
		  $(h1).each(function(i, link){
		  	if(!arrayObj[$(link).text()]){
		  	array.push($(link).text());
		  	arrayObj[$(link).text()] = true
		  	}
		  });


	     var links = $('a'); //jquery get all hyperlinks
		  $(links).each(function(i, link){
		   if(!visitedLink[$(link).attr('href')]){
		  	linkArray.push($(link).attr('href'));
		  	visitedLink[$(link).attr('href')] = true
		  	}
		  });

		  if(count ==  linkArray.length ){ 
		  	console.log('resolved the data')
		  	getLexigraphy(array)
		  }else{
		  	console.log(baseUrl+linkArray[count])
		  	crawl(baseUrl+linkArray[count])
		  	count++
		  }
		
	   }
	 });
	}
  	crawl(url)	
 
    //reject(new Error('NotImplemented'))
  })




