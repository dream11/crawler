/**
 * Created by tushar on 13/09/17.
 */

'use strict'
const http = require('http');

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
let links, smallestString, visited;

const getStringsAndUrls = (url, location, cb) => {
  const nextPage = url + location;
  http.get(nextPage, (res) => {
    res.setEncoding('utf8');      
    res.on('data', data => {
      const href = /href="(.*?)"/g;
      const linkRegex = /<a[^>]*>(.*?)<\/a>/g;
      const stringsRegex = /<h1[^>]*>(.*?)<\/h1>/g;
      var urlText, location = href.exec(data), tempString;
      while(urlText = linkRegex.exec(data)) {
        location = href.exec(data)[1];

        if(!visited[urlText[1]]) { 
          links.push({
            urlText: urlText[1],
            location
          });
          visited[urlText[1]] = true;
        }
      }
      while(tempString = stringsRegex.exec(data)) {
        if(tempString[1] < smallestString) {
          smallestString = tempString[1];
        }
      }
      if(links.length > 0) {
        getStringsAndUrls(url, links.pop().location, cb);
      } else {
        cb(smallestString);
      }
    });
});
};



module.exports = url =>
  new Promise((resolve, reject) => {
    /**
     * TODO: Write your high performance code here.
     */
    links = [{
      urlText: "home",
      location: '/'}];
    smallestString = 'zzzzzzzzzzzzzzzz';
    visited = {};
    getStringsAndUrls(url, links.pop().location, (answer) => resolve(answer));
  });
