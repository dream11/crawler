/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var request = require('request');
var FIFO = require("fifo");
var fifo = FIFO();
var linkStrings = {};
var bstrings = [];
var loopIntervalInstance = null;
var loopInterval = 20;
var requestCount = 0;
var responseCount = 0;
var mainUrl = "";
var TimSort = require('timsort');

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
		loopCrawler(cb);

		/*loopIntervalInstance = setInterval(function(){
			loopCrawler(cb);
		},loopInterval);*/
	});

}
 

function loopCrawler(cb){

	var popUrl = fifo.shift();
	if(popUrl){
		
		requestCount++;
		request(mainUrl+ "/"+popUrl,function(err,res,body){

			responseCount++;
			if(requestCount==responseCount && fifo.length==0){
			
				finishFunction(cb);
			}
			if(err){
				return;
			}
			parseBody(res.statusCode,body,popUrl);
			//console.log(fifo.length);
			loopCrawler(cb);

		});

	}
	
}

function finishFunction(cb){

	
	cb(findShortestLexString());

}

function parseBody(status, body,popUrl){


	if(typeof body == "string"){

		var re = /href=\"\/(.*)\"/gm;
		var re1 = /link\" href=\"\/(.*)\">([a-z0-9]{4})</gm;

		var reh1 = /<h1>(.*)<\/h1>/gm;

		//console.time("t5");
		var t = body.match(re1);
		var m;
		while( (m = re.exec(t)) != null){
			//console.log(m);
			var s1 = m[1].substr(0,32);
			//console.log(s1);
			re.lastIndex = m.index+1;

			if(!linkStrings[s1]){
				linkStrings[s1] = 1;
				fifo.push(s1);
			}			

		}
		//console.timeEnd("t5");
		/*
		
		console.time("t2");
		var root = HTMLParser.parse(body);
		console.timeEnd("t2");*/

		//var t1 = body.match(reh1);
		var n;
		while( (n = reh1.exec(body)) != null){
			//console.log(n);
			var s1 = n[1].substr(0,6);
			//console.log(s1);
			reh1.lastIndex = n.index+1;
			bstrings.push(s1);
			//fifo.push(s1);

		}


		/*console.time("t2");
		var root = HTMLParser.parse(body);
		console.timeEnd("t2");
		var re = /href=\"\/(.*)\"/gm;
		var re1 = /link\" href=\"\/(.*)\">([a-z0-9]{4})</gm;
		console.log("=======================================================");
		console.time("t1");
		var t = body.match(re1);
		console.timeEnd("t1");
		console.log(t);
		console.log("********************************************************");
		console.time("t3");
		var gg = t[0].match(re);
		re.lastIndex = 0;
		console.timeEnd("t3");
		console.log(gg);

		if(t){
			/*console.log("=======================================================");
			console.log(t[0] + '\n\n',t[1] );	
			console.log("=======================================================");*/
		//}
		

		//re1.lastIndex = 0;
		

		/*var linksElem = root.querySelectorAll('.link');
		for(var i in linksElem){
			
			var linksObj = re.exec(linksElem[i].rawAttrs);
			re.lastIndex = 0;
			var link = linksObj[1];

			if(!linkStrings[link]){
				linkStrings[link] = 1;
				a3c994551ec4e78d050b2d109fc2c432
			}	

		}*/

		/*var codes = root.querySelector('.codes');
		if(codes){

			for(var i in codes.childNodes){
			var lexString = codes.childNodes[i].childNodes['0'].rawText;
			
				
				bstrings.push(lexString);
			
			}

		}*/

	}

	if(status != "200"){
		
		fifo.push(popUrl);
		
	}

}


function findShortestLexString(){
	console.time("sorting");
	bstrings = bstrings.sort();
	//TimSort.sort(bstrings);
	console.timeEnd("sorting");
	/*
	var minString = bstrings[Object.keys(bstrings)[0]];
	for(var i in bstrings){

		if(bstrings[i]<minString){
			minString = bstrings[i];
		}

	}*/


	//console.log(bstrings);
	return bstrings[0];

}
