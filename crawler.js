/**
 * Created by tushar on 13/09/17.
 */

"use strict";
var request = require("superagent");
const cheerio = require("cheerio");

let traversedPaths; // Local cache. Use any high-performance lookup db like redis for shared systems with some ttl.
let smallestWord; // This would be the current smallest word. Initializing with some huge value;

function getSmallestString(codes) {
  return codes.reduce(function(currentSmallestWord, code) {
    return currentSmallestWord < code ? currentSmallestWord : code;
  }, smallestWord);
}

function getPaths($) {
  return $(".link")
    .map(function(i, elem) {
      return $(this).attr("href");
    })
    .get();
}

function getCodes($) {
  return $(".codes h1")
    .map(function(i, elem) {
      return $(this).text();
    })
    .get();
}

async function makeReq(url, result) {
  const response = await request.get(url);
  return response.text;
}

async function crawlPage(hash, rootUrl) {
  const response = await makeReq(`${rootUrl}${hash}`);
  const $ = cheerio.load(response);
  const codes = getCodes($);
  smallestWord = getSmallestString(codes);
  traversedPaths[hash] = true;
  const childPaths = getPaths($);

  for (let childPath of childPaths) {
    if (!(childPath in traversedPaths)) {
      const wait = await crawlPage(childPath, rootUrl);
    }
  }
}

module.exports = async function(url) {
  try {
    traversedPaths = {};
    smallestWord = "".padEnd("100", "z");
    const data = await crawlPage("", url);
    return smallestWord;
  } catch (error) {
    return error;
  }
};
