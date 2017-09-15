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
 	let array = []
	let linkArray = [];
	let visitedLink = {}
	let count = 0
	let arrayObj = {}
	let baseUrl = url
  	var crawl = async function  (url){
	request(url, function(error, response, body) {
	   if(error) {
	     console.log("Error: " + error);
	   }
	   // Check status code (200 is HTTP OK)
	   //console.log("Status code: " + response.statusCode);
	   if(response.statusCode === 200) {
	     // Parse the document body
	      let $ = cheerio.load(body);
	    
	      let h1 = $('.codes h1'); //jquery get all hyperlinks
		  $(h1).each(function(i, link){
		  	if(!arrayObj[$(link).text()]){
		  	array.push($(link).text());
		  	arrayObj[$(link).text()] = true
		  	}
		  });


	     let links = $('.link'); //jquery get all hyperlinks
		  $(links).each(function(i, link){
		   if(!visitedLink[$(link).attr('href')]){
		  	linkArray.push($(link).attr('href'));
		  	visitedLink[$(link).attr('href')] = true
		  	}
		  });

		  if(count ==  linkArray.length ){ 
		  	console.log('resolved the data')
		  	resolve(array.sort()[0])
		  }else{
		  	console.log(baseUrl+linkArray[count])
		  	
		  	if(count > 100){
		  		crawl(baseUrl+linkArray[count])
			  	crawl(baseUrl+linkArray[count+1])
			  	crawl(baseUrl+linkArray[count+2])
			  	count ++
		  	}else{
		  	  crawl(baseUrl+linkArray[count])
		  	  count ++
		  	}
		  	
		  }
		
	   }
	 });
	}
  	crawl(url)	
 
    //reject(new Error('NotImplemented'))
  })




