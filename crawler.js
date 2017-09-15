/**
 * Created by sgsvenkatesh on 15/09/17.
 */

'use strict';

module.exports = url =>
	new Promise((resolve, reject) => {
		let request = require('request');
		let cheerio = require('cheerio');
		let strings = [];
		let visitedUrls = [];
		let count = { urlsFetched: 0, callbacksReturned: 0 };
		
		function fetchUrlAndSaveStrings(pathUrl) {
			count.urlsFetched += 1;
			request(url + pathUrl, function(error, response, html) {
				if (error) {
					count.urlsFetched -= 1;
					return "";
				}
				let $ = cheerio.load(html);
				
				if (!visitedUrls.includes(pathUrl)) {
					$(".codes").children().each((index, elm) => {
						strings.push($(elm).text());
						visitedUrls.push(pathUrl);
					});
					
					const links = $("a.link");
					if (links.length !== 0) {
						links.each((index, thisAnchorEl) => {
							const thisUrl = $(thisAnchorEl).attr("href");
							!visitedUrls.includes(thisUrl) && fetchUrlAndSaveStrings(thisUrl);
						});
					}
				}
				
				count.callbacksReturned += 1;
				
				if (count.urlsFetched === count.callbacksReturned) {
					let bestStrFound = "";
					strings.forEach(str => {
						if (!bestStrFound) { bestStrFound = str; }
						else if (str < bestStrFound) {
							bestStrFound = str;
						}
					});
					resolve(bestStrFound);
				}
			});
		}
		
		fetchUrlAndSaveStrings('');
	});
