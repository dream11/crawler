/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var request = require('request');
var FIFO = require("fifo");
var fifo = FIFO();
var HTMLParser = require('fast-html-parser');
var linkStrings = {};
var bstrings = [];
var loopIntervalInstance = null;
var loopInterval = 10;
var requestCount = 0;
var responseCount = 0;
var mainUrl = "";

/*var responseTimeoutInstancee = null;
var responseTimeoutDuration = 3000;*/
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
	
  	crawl(url,function(str){
  		resolve(str);
  	});
  	//resolve({});
    //reject(new Error('NotImplemented'))
  });

function crawl(url,cb){
	mainUrl = url;
	request(url,function(err,res,body){
		
		parseBody(res.statusCode,body);
		loopIntervalInstance = setInterval(function(){
			loopCrawler(cb);
		},loopInterval);
	});

}
 

function loopCrawler(cb){

	var popUrl = fifo.shift();
	if(!popUrl){

		if(requestCount==responseCount){
			
			finishFunction(cb);
		}

	}
	else{
		
		requestCount++;
		request(mainUrl+ "/"+popUrl,function(err,res,body){

			responseCount++;
			if(err){
				return;
			}
			parseBody(res.statusCode,body,popUrl);

		});

	}
	
}

function finishFunction(cb){

	clearInterval(loopIntervalInstance);
	cb(findShortestLexString());

}

function parseBody(status, body,popUrl){


	if(typeof body == "string"){

		var root = HTMLParser.parse(body);
		var re = /href=\"\/(.*)\"/g;
		var linksElem = root.querySelectorAll('.link');
		for(var i in linksElem){
			
			var linksObj = re.exec(linksElem[i].rawAttrs);
			re.lastIndex = 0;
			var link = linksObj[1];

			if(!linkStrings[link]){
				linkStrings[link] = 1;
				fifo.push(link);
			}	

		}

		var codes = root.querySelector('.codes');
		if(codes){

			for(var i in codes.childNodes){
			var lexString = codes.childNodes[i].childNodes['0'].rawText;
			
				
				bstrings.push(lexString);
			
			}

		}

	}

	if(status != "200"){
		
		fifo.push(popUrl);
		
	}

}

function lexcheck(string){

	for(var i=1;i<string.length;i++){
		if(string.charCodeAt(i)<string.charCodeAt(i-1)){
			return false;
		}		
	}
	return true;

}


function findShortestLexString(){
	bstrings = bstrings.sort(function(a, b){
	    if(a < b) return -1;
	    if(a > b) return 1;
	    return 0;
	});
	/*
	var minString = bstrings[Object.keys(bstrings)[0]];
	for(var i in bstrings){

		if(bstrings[i]<minString){
			minString = bstrings[i];
		}

	}*/


	console.log(bstrings);
	return bstrings[0];

}