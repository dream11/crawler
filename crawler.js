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


/*var responseTimeoutInstancee = null;
var responseTimeoutDuration = 3000;*/
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
    new Promise((resolve, reject) => {

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
        count++;

        /*loopIntervalInstance = setInterval(function(){
        	loopCrawler(cb);
        },loopInterval);*/
    });

}


const loopCrawler = async (cb,url) => {
	//console.log(url,count);
    var popUrl = url;
    //count++;

    if (popUrl) {

        requestCount++;
        //console.log(concurrentRequests);
        request(mainUrl + popUrl, function(err, res, body) {

            //console.log(requestCount, responseCount,count,linksArr.length);
            responseCount++;

            if (requestCount == responseCount && count == linksArr.length) {

                finishFunction(cb);
            }
            if(requestCount> responseCount && responseCount == linksArr.length){
            	finishFunction(cb);	
            }
            if (err) {
                return;
            }
            parseBody(res.statusCode, body, popUrl);

            
            loopCrawler(cb,linksArr[count]);
            if(count<150 || count > 500){
            	loopCrawler(cb,linksArr[count+1]);
            	//loopCrawler(cb,linksArr[count+2]);
            	//count++;
            }
            count++;

        });

    }

}

function finishFunction(cb) {


    //cb(findShortestLexString());
    console.log(minString);
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