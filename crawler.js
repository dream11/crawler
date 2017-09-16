/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var cheerio = require('cheerio');
var request = require('request');

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

module.exports = (url) => {
    return new Promise((resolve, reject) => {
		var answer = '';
		var pageVisited = {};
		var externalLinks = [];
        var BASE_URL = url;

		function crawl(url, cb) {
			// console.log('URL > ',url);
		    if (url && !pageVisited[url]) {
		        pageVisited[url] = true;
		        getStrings(url, cb);
		    } else {
		        var nextPage = externalLinks.pop();
		        if (nextPage) {
		            crawl(nextPage, cb);
		        } else {
		            cb();
		        }
		    }
		}

		function getStrings(url, cb) {
		    request(url, function(error, response, body) {
		        if (response.statusCode !== 200) {
		        	pageVisited[url] = false;
			        crawl(externalLinks.pop(), cb);
		            return;
		        }
		        let $ = cheerio(body);
		        $.find('h1').each((s, elem) => {
		            if (!answer) {
		                answer = elem.children[0].data;
		            } else if (elem.children[0].data < answer) {
		                answer = elem.children[0].data;
		            }
		        });
		        $.find('a').each((d, s) => {
		            externalLinks.push(BASE_URL + s.attribs.href);
		        });
		        crawl(externalLinks.pop(), cb);
		    });
		}

        crawl(url, () => {
            if (answer) {
                resolve(answer);
            }
        });
    })
}