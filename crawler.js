/**
 * Created by tushar on 13/09/17.
 */

'use strict'
var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');
var sleep = require('sleep')

var urls = {};
var baseUrl = '';
var allSmallest = [];
var rateLimitedQueue = [];
var unVisitedUrls = [];
var randomSleeps = 0;
/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    /**
     * TODO: Write your high performance code here.
     */
    baseUrl = url;
    urls[url] = {
    	sent: false,
    	visited: false,
    	wasRateLimited: false,
    };
    const startCrawl = (url) => {
    	requestPromise(url).then(function(data){
    		if(unVisitedUrls.length > 0){
    			startCrawl(unVisitedUrls[0]);
    		}
    		else{
    			console.log(randomSleeps, '----Sleeps');
    			resolve(smallestString(allSmallest));
    		}
    	}, function(err){
    		if(rateLimitedQueue.length > 0){
    			var rateLimitedUrl = rateLimitedQueue[0];
    			randomSleeps++;
    			startCrawl(rateLimitedUrl);
    		}
    	}).catch(function(err){
    		console.log('catch the error', err);
    		reject('some error');
    	});
    }
    startCrawl(url);
  });

const smallestString = (stringArray) => stringArray.sort()[0]

const requestPromise = (url) =>  {
	if(!urls[url].sent || (urls[url].sent && !urls[url].visited)){
		urls[url].sent = true;
		return new Promise((resolve, reject) => {
			rp({ uri: url, resolveWithFullResponse: true })
			.then(function (response) {
		        if(response.statusCode == 200){
		        	urls[url].visited = true;
		        	if(urls[url].wasRateLimited){
		        		rateLimitedQueue.splice(rateLimitedQueue.indexOf(url), 1);
		        	}
		        	unVisitedUrls.splice(unVisitedUrls.indexOf(url), 1);
		        	resolve(htmlExtractor(response.body));
		        }
		    })
		    .catch(function (err) {
		       if(err.statusCode == 429){
		       	if(!urls[url].wasRateLimited){
		       		urls[url].sent = true;
		       		urls[url].wasRateLimited = true;
		       		rateLimitedQueue.push(url);
		       	}
		       	reject('RateLimit Exceeded');
		       }
		    });
		})
	}
	else{
		return Promise.resolve();
	}
}

const htmlExtractor = (body) => new Promise( (resolve, reject) => {
	var stringsInPage = [];
	var newFoundUrls = [];
	var $ = cheerio.load(body);
	$('.codes h1').each(function(i, elem) {
	  // stringsInPage.push($(this).text());
	  allSmallest.push($(this).text());
	});

	$('a.link').each(function(i, elem){
		var href = $(this).attr('href');
		var absoluteUrl = baseUrl+href;
		if(!urls[absoluteUrl]){
			urls[absoluteUrl] = {
				sent: false,
				visited: false,
				wasRateLimited: false,
			}
			newFoundUrls.push(absoluteUrl);
			unVisitedUrls.push(absoluteUrl);
		}
	});
	/*var currentSmallest = smallestString(stringsInPage);
	if(allSmallest.indexOf(currentSmallest) < 0){
		allSmallest.push(currentSmallest);
	}*/
	resolve(Promise.all(newFoundUrls.map(requestPromise)));// Map our array of newUrls to an array of page promises	
	// resolve(Promise.resolve());
});

