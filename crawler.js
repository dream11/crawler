/**
 * Created by sgsvenkatesh on 15/09/17.
 */

'use strict';

module.exports = function (url) {
	return new Promise(function (resolve) {
		let request = require('request');
		let bestString = "zzzzzzzzzzz";
		let visitedUrls = {};
		let pendingUrls = [];
		const strs = [];
		let count = { urlsFetched: 0, callbacksReturned: 0 };
		let throttleCount = 499;
		let makeSlowCount = 249;
		
		const fetchUrlAndSaveStrings = async (pathUrl) => {
			count.urlsFetched += 1;
			request(url + pathUrl, function (error, response, html) {
				if (error) {
					count.urlsFetched -= 1;
					!visitedUrls[pathUrl] && checkAndCallFetchUrl(pathUrl);
					return;
				}
				
				if (!visitedUrls[pathUrl]) {
					visitedUrls[pathUrl] = true;
					const h1Tags = html.match(/<h1>(.*?)<\/h1>/g);
					h1Tags && h1Tags.forEach(thisTag => {
						const str = thisTag.slice(4, thisTag.indexOf("</"));
						if (str < bestString) { bestString = str; }
					});
					
					const aTags = html.match(/href="(.*?)"/g);
					aTags && aTags.forEach((el, i) => {
						if (i === 0) { return; }
						const link = el.slice(6, -1);
						!visitedUrls[link] && checkAndCallFetchUrl(link);
					});
				}
				
				count.callbacksReturned += 1;
				if (count.urlsFetched === count.callbacksReturned) {
					if (pendingUrls.length === 0) {
						return resolve(bestString);
					} else {
						const pendingUrlsClone = pendingUrls.slice();
						const pendingUrlsClone1 = pendingUrlsClone.slice();
						pendingUrls = [];
						for (let i = pendingUrlsClone1.length - 1; i >= 0; i--) {
							const url = pendingUrlsClone1[i];
							!visitedUrls[url] && checkAndCallFetchUrl(url);
							pendingUrlsClone.pop();
						}
						pendingUrlsClone.forEach(url => {
							if (!visitedUrls[url]) {
								pendingUrls.push(url);
							}
						})
					}
				}
			});
		};
		
		function checkAndCallFetchUrl(link) {
			if (count.urlsFetched - count.callbacksReturned > throttleCount) {
				pendingUrls.push(link);
			} else {
				if (count.urlsFetched - count.callbacksReturned > makeSlowCount) {
					setTimeout(function() {
						fetchUrlAndSaveStrings(link)
					}, 0);
				} else {
					return fetchUrlAndSaveStrings(link);
				}
			}
		}
		
		return fetchUrlAndSaveStrings('');
	});
};
