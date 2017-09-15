/**
 * Created by sgsvenkatesh on 15/09/17.
 */

'use strict';

module.exports = function (url) {
	return new Promise(function (resolve) {
		let request = require('request');
		let bestString = "zzzzzz";
		let visitedUrls = {};
		let count = { urlsFetched: 0, callbacksReturned: 0 };
		
		function fetchUrlAndSaveStrings(pathUrl) {
			count.urlsFetched += 1;
			request(url + pathUrl, function (error, response, html) {
				if (error) { count.urlsFetched -= 1; return; }
				
				if (!visitedUrls[pathUrl]) {
					const h1Matches = html.match(/<h1>(.*?)<\/h1>/g);
					if (h1Matches) {
						h1Matches.forEach(thisH1Tag => {
							const str = thisH1Tag.slice(4, 10);
							if (str < bestString) { bestString = str; }
							visitedUrls[pathUrl] = true;
						});
					}
					
					const hrefMatches = html.match(/href="(.*?)"/g);
					if (hrefMatches) {
						hrefMatches.forEach((thisHrefStr, index) => {
							if (index === 0) { return; }
							const thisUrl = thisHrefStr.slice(6, -1);
							!visitedUrls[thisUrl] && fetchUrlAndSaveStrings(thisUrl);
						});
					}
				}
				count.callbacksReturned += 1;
				count.urlsFetched === count.callbacksReturned && resolve(bestString);
			});
		}
		
		fetchUrlAndSaveStrings('');
	});
};
