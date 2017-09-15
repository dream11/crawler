'use strict';

const curl = require('./curl');

const getMatches = (str, regex) => {

  let m = [];
  const matches = [];

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        matches.push(match);
      }
    });
  }
  return matches;
};

const curlUrl = (url) => {

 const linkRegex = /href="(.*?)"/gm;
 const tagRegex = /<h1>(.*?)<\/h1>/gm;

  return new Promise((resolve, reject) => {
    curl(url).then((res) => {
      const linkList = getMatches(res, linkRegex);
      const tags = getMatches(res, tagRegex);
      const hostArr = url.split('/');
      const host = hostArr[2] || hostArr[0];
      const links = linkList.map((link) => link.substr(0, 1) === '/' ? host + link : link);
      console.log(links);
      resolve({links, tag: tags.sort()[0]});
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
};

const crawlLinks = (links, visited, tags) => {

  return new Promise((resolve, reject) => {

    if (links.length === 0) {
      resolve();
      return;
    }

    let link = [];
    const promiseList = [];

    while (links.length) {
      link = links.pop();
      if (visited[link]) continue;
      visited[link] = true;
      promiseList.push(curlUrl(link));
    }

    Promise.all(promiseList).then((values) => {

      values.forEach((v) => {
        v.links.filter(l => {
          if (!visited[l]) {
            links.push(l);
          }
        });
        tags.push(v.tag);
        tags.sort().splice(1, 1);
      });

      resolve(crawlLinks(links, visited, tags));
    }).catch((error) => {
      console.log(error);
      reject(error);
    });
  });
};

/*
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>

  new Promise((resolve, reject) => {

    const links = [url];
    const visited = {};
    const tags = [];

    crawlLinks(links, visited, tags).then(() => {
      resolve(tags[0]);
    }).catch(function(err) {
      reject(err);
    });
  });
