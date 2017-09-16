/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var request = require('request');
var FIFO = require("fifo");
var fifo = FIFO();
var count = 0;
var linkStrings = {};
var bstrings = [];
var linksArr = [];
var loopIntervalInstance = null;
var loopInterval = 20;
var requestCount = 0;
var responseCount = 0;
var concurrentRequests = 0;
var mainUrl = "";
var minString = "zzzzzzzz"
var done = 0;


/*var responseTimeoutInstancee = null;
var responseTimeoutDuration = 3000;*/
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
    new Promise((resolve, reject) => {

    	count = 0;
    	linkStrings = {};
    	bstrings = [];
    	linksArr = [];
    	requestCount = 0;
		responseCount = 0;
		concurrentRequests = 0;
		mainUrl = "";
		minString = "zzzzzzzz"
		done = 0;

        crawl(url, function(str) {
            resolve(str);            
        });
        //resolve({});
        //reject(new Error('NotImplemented'))
    });

function crawl(url, cb) {
    mainUrl = url;
    request(url, function(err, res, body) {

        parseBody(res.statusCode, body);
        loopCrawler(cb,linksArr[count]);
        //count++;
    });

}


const loopCrawler = async (cb,url) => {
	
    var popUrl = url;
    //count++;
    //console.log(url,count,mainUrl + popUrl);
    if (popUrl && !done && requestCount < linksArr.length) {

        requestCount++;
        //console.log(concurrentRequests);
        request(mainUrl + '/' +popUrl, function(err, res, body) {

            if(done) return;
            responseCount++;
            //console.log(requestCount, responseCount,count,linksArr.length);
            //console.log(linksArr);
            /*if (requestCount == responseCount && count == linksArr.length) {

                finishFunction(cb);
            }*/
            if(responseCount>200 && responseCount >= linksArr.length && (count+1)>=linksArr.length){
            	console.log("===========================================calling finish")
            	finishFunction(cb);	
            }
            if (err) {
            	console.log(err);
            	linksArr.push(url);
                return;
            }
            parseBody(res.statusCode, body, popUrl);

            
            loopCrawler(cb,linksArr[count]);
            if(count<50 /*&& count < 200*/){
            	loopCrawler(cb,linksArr[count+1]);
            }
            /*if(count<150 || (count > 500 && count < 800) ){
            	loopCrawler(cb,linksArr[count+1]);
            	//loopCrawler(cb,linksArr[count+2]);
            	//count++;
            }*/
            count++;

        });

    }

}

function finishFunction(cb) {


    //cb(findShortestLexString());
    //console.log(minString);
    done = 1;
    cb(minString);
}


function parseBody(status, body, popUrl) {


    if (typeof body == "string") {

        var re = /href=\"\/(.*)\"/gm;
        var re1 = /link\" href=\"\/(.*)\">([a-z0-9]{4})</gm;

        var reh1 = /<h1>(.*)<\/h1>/gm;


        var t = body.match(re1);
        var m;
        while ((m = re.exec(t)) != null) {

            var s1 = m[1].substr(0, 32);

            re.lastIndex = m.index + 1;

            if (!linkStrings[s1]) {
                linkStrings[s1] = 1;
                fifo.push(s1);
                linksArr.push(s1);
            }

        }

        var n;
        while ((n = reh1.exec(body)) != null) {
            //console.log(n);
            var s1 = n[1].substr(0, 6);
            //console.log(s1);
            reh1.lastIndex = n.index + 1;
            if (s1 < minString)
                minString = s1;
            //bstrings.push(s1);
            //fifo.push(s1);

        }




    }



}


function findShortestLexString() {

    bstrings = bstrings.sort();



    return bstrings[0];

}