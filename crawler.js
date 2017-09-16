/**
 * Created by sgsvenkatesh on 15/09/17.
 */

'use strict';

module.exports = function (url) {
	return new Promise(function (resolve) {
		let request = require('request');
		let cheerio = require('cheerio');
		let bestString = "zzzzzz";
		let visitedUrls = {};
		let count = { urlsFetched: 0, callbacksReturned: 0 };
		
		function fetchUrlAndSaveStrings(pathUrl) {
			count.urlsFetched += 1;
			request(url + pathUrl, function (error, response) {
				if (error) {
					count.urlsFetched -= 1;
					!visitedUrls[pathUrl] && fetchUrlAndSaveStrings(pathUrl);
					return;
				}
				
				const $ = cheerio.load(response.body);
				
				if (!visitedUrls[pathUrl]) {
					$(".codes h1").each((index, el) => {
						const str = $(el).text();
						if (str < bestString) { bestString = str; }
						visitedUrls[pathUrl] = true;
					});
					
					$("a.link").each((index, el) => {
						const link = $(el).attr("href");
						!visitedUrls[link] && fetchUrlAndSaveStrings(link);
					});
				}
				
				count.callbacksReturned += 1;
				count.urlsFetched === count.callbacksReturned && resolve(bestString);
			});
		}
		
		fetchUrlAndSaveStrings('');
	});
};
