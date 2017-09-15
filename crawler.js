/**
 * Created by tushar on 13/09/17.
 */

'use strict'

var Xray = require('x-ray');
var x = Xray();
var cheerio = require('cheerio');
var request = require('request');

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */

var answer = '';
var pageVisited = {};
var externalLinks = [];
var BASE_URL = null;

function crawl(url, cb) {
    if (!pageVisited[url]) {
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
            return;
        }
        cheerio(body).find('h1').each((s, elem) => {
            if (!answer) {
                answer = elem.children[0].data;
            } else if (elem.children[0].data < answer) {
                answer = elem.children[0].data;
            }
        });
        cheerio(body).find('a').each((d, s) => {
            externalLinks.push(BASE_URL + s.attribs.href);
        });
        crawl(externalLinks.pop(), cb);
    });
}

module.exports = url =>
    new Promise((resolve, reject) => {
        BASE_URL = url;
        crawl(url, () => {
            if (answer) {
                resolve(answer);
            }
        });
    })