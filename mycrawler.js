/**
* Created by tushar on 13/09/17.
*/

'use strict'

var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var START_URL = "http://localhost:8080";

var pagesVisited = {};
var pagesToBeVisited = {};
var stringsFound = 0;
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var firstLexographicWord = '';
var maxPagesToBeVisited = 10;
var promiseForFetch;

function crawl() {
	var nextPage = pagesToVisit.pop();
	if (nextPage) {
		visitPage(nextPage, crawl);
	} else {
		console.log("Visited: " + numPagesVisited + " pages");
		console.log("Total strings: " + stringsFound + " strings");
		console.log("First Lexographic Word: "+firstLexographicWord);
		if (promiseForFetch) {
			promiseForFetch.resolve(firstLexographicWord);
		}
	}
}

function searchForWords($) {
	$(".codes h1").each(function() {
		if (stringsFound) {
			const item = $(this).text();
			if (firstLexographicWord > item) {
				firstLexographicWord = item;
			}
		} else {
			const item = $(this).text();
			firstLexographicWord = item;
		}
		stringsFound++;
	});
}

function getAbsolutePath(base, relative) {

	// if (relative[0] === "/") {
	// 	relative = '.' + relative;
	// }
	// var stack = base.split("/"),
	// parts = relative.split("/");
	// stack.pop();
	// // remove current file name (or empty string)
	// // (omit if "base" is the current folder without trailing slash)
	// for (var i=0; i<parts.length; i++) {
	// 	if (parts[i] == ".")
	// 		continue;
	// 	if (parts[i] == "..")
	// 		stack.pop();
	// 	else
	// 		stack.push(parts[i]);
	// }
	// return stack.join("/");
	return START_URL + relative;
}


function collectInternalLinks($, url) {
	var allRelativeLinks = [];
	var allAbsoluteLinks = [];

	var relativeLinks = $("a[href^='/']");
	relativeLinks.each(function() {
		var fullUrl = getAbsolutePath(url, $(this).attr('href'));
		if (fullUrl in pagesVisited || fullUrl in pagesToBeVisited) {
			// nothing
		} else {
			allRelativeLinks.push(fullUrl);
			pagesToVisit.push(fullUrl);
			pagesToBeVisited[url] = true;
		}
	});

	var absoluteLinks = $("a[href^='http']");
	absoluteLinks.each(function() {
		var fullUrl = $(this).attr('href');
		if (fullUrl in pagesVisited || fullUrl in pagesToBeVisited) {
			// nothing
		} else {
			allAbsoluteLinks.push(fullUrl);
			pagesToVisit.push(fullUrl);
			pagesToBeVisited[url] = true;
		}
	});

	console.log("Found " + allRelativeLinks.length + " relative links");
	console.log("Found " + allAbsoluteLinks.length + " absolute links");
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
	console.log("Visiting page " + url);
	request(url, function(error, response, body) {
		// Check status code (200 is HTTP OK)
		console.log("Status code: " + response.statusCode);
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

pagesToVisit.push(START_URL);
crawl();
