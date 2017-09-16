/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var request = require('request');
var count = 0;
var linkStrings = {};
var bstrings = [];
var linksArr = [];
var requestCount = 0;
var responseCount = 0;
var concurrentRequests = 0;
var mainUrl = "";
var minString = "zzzzzzzz";
var TimSort = require('timsort');
var done = 0;
var requestsArr = [];
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
		var TimSort = require('timsort');

        crawl(url, function(str) {
            resolve(str);            
        });
    });

function crawl(url, cb) {
    mainUrl = url;
    request(url, function(err, res, body) {

        parseBody(res.statusCode, body);
        loopCrawler(cb,linksArr[count]);
    });

}


const loopCrawler = async (cb,url) => {
	
  
    if (url && !done && requestCount < linksArr.length) {

        requestCount++;

        request(mainUrl + '/' +url, function(err, res, body) {

            if(done) return;
            responseCount++;
            //console.log(requestCount, responseCount,count,linksArr.length);
            
            if(responseCount>200 && responseCount >= linksArr.length && (count+1)>=linksArr.length){
            	done = 1;
            	//TimSort.sort(bstrings);
    			cb(minString);
            }
            if (err) {
            	console.log(err);
            	linksArr.push(url);
                return;
            }
            parseBody(res.statusCode, body, url);
            loopCrawler(cb,linksArr[count]);	
            
            count++;

        });

    }

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
                
                linksArr.push(s1);
            }

        }

        var n;
        while ((n = reh1.exec(body)) != null) {
            var s1 = n[1].substr(0, 6);
            reh1.lastIndex = n.index + 1;

            if (s1 < minString)
                minString = s1;
        }

    }

}
