/**
* Created by tushar on 13/09/17.
*/

'use strict'

/**
* Crawls a website using a start {url}, and returns the lexicographically smallest string.
* @param url
* @return {Promise.<string>}
*/

var PromiseDefer =  require('promise-defer');
var request = require('request');
var cheerio = require('cheerio');
//var URL = require('url-parse');

var START_URL = "http://localhost:8080";

var pagesVisited = {};
var pagesToBeVisited = {};
var stringsFound = 0;
var numPagesVisited = 0;
var pagesToVisit = [];
//var url = new URL(START_URL);
var firstLexographicWord = '';
var maxPagesToBeVisited = 10;
var promiseForFetch = new PromiseDefer();

function crawl() {
	var nextPage = pagesToVisit.pop();
	if (nextPage) {
		visitPage(nextPage, crawl);
	} else {
		// console.log("Visited: " + numPagesVisited + " pages");
		// console.log("Total strings: " + stringsFound + " strings");
		// console.log("First Lexographic Word: "+firstLexographicWord);
		promiseForFetch.resolve(firstLexographicWord);
	}
}

function searchForWords($) {
	var data = $("h1");
	data.each(function() {
		const item = $(this).text();
		if (stringsFound) {
			if (firstLexographicWord > item) {
				firstLexographicWord = item;
			}
		} else {
			firstLexographicWord = item;
		}
		stringsFound++;
	});
}


function collectInternalLinks($, url) {
	// var allRelativeLinks = [];
	// var allAbsoluteLinks = [];

	var relativeLinks = $("a[href^='/']");
	relativeLinks.each(function() {
		var fullUrl = START_URL +  $(this).attr('href');
		if (fullUrl in pagesVisited && fullUrl in pagesToBeVisited) {
			// nothing
		} else {
			//allRelativeLinks.push(fullUrl);
			pagesToVisit.push(fullUrl);
			pagesToBeVisited[url] = true;
		}
	});

	// var absoluteLinks = $("a[href^='http']");
	// absoluteLinks.each(function() {
	// 	var fullUrl = $(this).attr('href');
	// 	if (fullUrl in pagesToBeVisited) {
	// 		// nothing
	// 	} else {
	// 		allAbsoluteLinks.push(fullUrl);
	// 		pagesToVisit.push(fullUrl);
	// 		pagesToBeVisited[url] = true;
	// 	}
	// });

	// console.log("Found " + allRelativeLinks.length + " relative links");
	// console.log("Found " + allAbsoluteLinks.length + " absolute links");
}

function visitPage(url, callback) {
	// Add page to our set

	if (url in pagesVisited) {
		callback();
		return;
	}

	pagesVisited[url] = true;
	delete pagesToBeVisited[url];
	numPagesVisited++;

	// Make the request
	//console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		// Check status code (200 is HTTP OK)
		//console.log("Status code: " + response.statusCode);
		if(response.statusCode !== 200) {
			callback();
			return;
		}
		// Parse the document body
		var $ = cheerio.load(body);
		searchForWords($);
		collectInternalLinks($, url);
		// In this short program, our callback is just calling crawl()
		callback();
	});
}

module.exports = url =>
new Promise((resolve) => {
	pagesVisited = {};
	pagesToBeVisited = {};
	stringsFound = 0;
	numPagesVisited = 0;
	pagesToVisit = [];
	firstLexographicWord = '';
	maxPagesToBeVisited = 10;
	promiseForFetch = new PromiseDefer();

	START_URL = url;
	pagesToVisit.push(START_URL);
	crawl();
	return promiseForFetch.promise.then((data) => {
		resolve(data);
	});
});
