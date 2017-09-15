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
					if (h1Matches) { // splitting this for perf
						if (h1Matches.length === 1) {
							const code = h1Matches[0].slice(4, 10);
							if (code < bestString) { bestString = code; }
						}
						else if (h1Matches.length === 2) {
							const code1 = h1Matches[0].slice(4, 10);
							const code2 = h1Matches[1].slice(4, 10);
							const localBestString = (code1 < code2 ? code1 : code2);
							if (localBestString < bestString) { bestString = localBestString }
						} else {
							h1Matches.forEach(thisH1Tag => {
								const str = thisH1Tag.slice(4, 10);
								if (str < bestString) { bestString = str; }
							});
						}
						visitedUrls[pathUrl] = true;
					}
					
					let hrefMatches = html.match(/href="(.*?)"/g);
					if (hrefMatches && hrefMatches.length > 3) {
						// const url1 = hrefMatches[1].slice(6, -1);
						const url2 = hrefMatches[2].slice(6, -1);
						// !visitedUrls[url1] && fetchUrlAndSaveStrings(url1);
						!visitedUrls[url2] && fetchUrlAndSaveStrings(url2);
					}
				}
				count.callbacksReturned += 1;
				count.urlsFetched === count.callbacksReturned && resolve(bestString);
			});
		}
		
		fetchUrlAndSaveStrings('');
	});
};
