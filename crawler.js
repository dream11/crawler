/**
 * Created by tushar on 13/09/17.
 */

'use strict'
let request = require('request');

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
    new Promise((resolve, reject) => {

        let smallestString = ""
        let uniqueUrls = {};
        let arrListUrlToVisit = ["/"];

        let maxParallelReq = 10;
        let currentRequestCount = 0;

        let iTotalReqCount = 0;

        console.log("starting...");
        let startDate = Date.now();

        function sendParallelRequests() {
            let iReqToSend = maxParallelReq - currentRequestCount;

            if (arrListUrlToVisit.length < iReqToSend) {
                iReqToSend = arrListUrlToVisit.length;
            }

            let arrUrls = arrListUrlToVisit.splice(0, iReqToSend);
            for (let i = 0; i < arrUrls.length; i++) {
                if (!uniqueUrls[arrUrls[i]]) {
                    let strReqUrl = url + arrUrls[i];
                    uniqueUrls[arrUrls[i]] = 1;
                    currentRequestCount++;
                    sendRequest(strReqUrl, 0, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        currentRequestCount--;
                        //if (currentRequestCount == 0)
                        sendParallelRequests();
                    });
                }
            }

            if (arrListUrlToVisit.length == 0 && currentRequestCount == 0) {
                console.log("Smallest String:: " + smallestString);
                console.log("TimeTaken:: " + (Date.now() - startDate) + " totalReq:: " + (iTotalReqCount));
                resolve(smallestString);
                return;
            }
        }

        function sendRequest(strReqUrl, iRetryCount, fnCallback) {
            //console.log("sendRequest::" + strReqUrl);
            if (iRetryCount > 5) {
                fnCallback("error:: could not fetch response::" + strReqUrl);
                return;
            }
            request(strReqUrl, function(error, response, body) {
                if (error || (response && response.statusCode != 200)) {
                    setTimeout(function() {
                        sendRequest(strReqUrl, iRetryCount + 1, fnCallback);
                    }, 2000);
                } else {
                    parseCrawlerResponse(body);
                    fnCallback(null);
                }
            });
        }

        function parseCrawlerResponse(body) {
            iTotalReqCount++;
            //console.log("reqCount::" + iTotalReqCount + " time::" + ((Date.now() - startDate) / 1000));
            //console.time("htmlParsing");
            let cheerio = require('cheerio');
            let $ = cheerio.load(body);
            $(".codes h1").each((index, el) => {
                let str = $(el).text();
                if (str.length) {
                    if (smallestString.length == 0) {
                        smallestString = str;
                        //console.log("smallestString::" + smallestString);
                    }
                    if (str < smallestString) {
                        smallestString = str;
                        //console.log("smallestString::" + smallestString);
                    }
                }
            });

            $("a.link").each((index, el) => {
                let link = $(el).attr("href");
                if (link && !uniqueUrls[link]) {
                    arrListUrlToVisit.push(link);
                    //console.log("link::" + link);
                } else {
                    //console.log("duplicatelink::" + link);
                }
            });

            //console.timeEnd("htmlParsing");
        }

        sendParallelRequests();

    })