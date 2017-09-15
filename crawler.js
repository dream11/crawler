/**
 * Created by tushar on 13/09/17.
 */

'use strict'
var cheerio = require('cheerio');
var request = require('request');
var rp = require('request-promise');

var urls = {};
var baseUrl = '';
var allSmallest = [];
var rateLimitedQueue = [];
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
    };
    requestPromise(url).then(function(){
    	if(rateLimitedQueue.length > 0){
    		console.log('I am having some items');
    	}
    	resolve(smallestString(allSmallest));
    }, function(err){
    	console.log(err);
    	reject('some in value resolve error');
    }).catch(function(err){
    	console.log('catch the error', err);
    	reject('some error');
    });
  });

const smallestString = (stringArray) => stringArray.sort()[0]

const requestPromise = (url) =>  {
	if(!urls[url].sent){
		urls[url].sent = true;
		return new Promise((resolve, reject) => {
			rp({ uri: url, resolveWithFullResponse: true })
			.then(function (response) {
		        if(response.statusCode == 200){
		        	urls[url].visited = true;
		        	resolve(htmlExtractor(response.body));
		        }
		    })
		    .catch(function (err) {
		       if(err && typeof err === 'object' && err.statusCode == 429){
		       	urls[url].sent = false;
		       	rateLimitedQueue.push(url);
		       	resolve(Promise.resolve());
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
	  stringsInPage.push($(this).text());
	});

	$('a.link').each(function(i, elem){
		var href = $(this).attr('href');
		var absoluteUrl = baseUrl+href;
		if(!urls[absoluteUrl]){
			urls[absoluteUrl] = {
				sent: false,
				visited: false,
			}
			newFoundUrls.push(absoluteUrl);
		}
	});
	console.log(newFoundUrls,'-------');
	allSmallest.push(smallestString(stringsInPage));
	 if(newFoundUrls.length > 0){
		resolve(Promise.all(newFoundUrls.map(requestPromise)));// Map our array of newUrls to an array of page promises
	}
	else {
		resolve(Promise.resolve());
	}
});
