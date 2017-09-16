/**
 * Created by tushar on 13/09/17.
 */

"use strict";

const nodeCrawler = require("crawler");
const cluster = require("cluster");
const port = (process.env.PORT = process.env.PORT || 8081);
const cpuCount = require("os").cpus().length;

const getMinStr = (list = []) => {
  if (list.length === 1) return list[0];
  else {
    let result = list[0];
    list.forEach(item => {
      if (item < result) result = item;
    });
    return result;
  }
};

const getLexMin = (resolve, reject) => {
  let minStr = null;
  let that = this;
  console.log(that, this, "lets see...");

  return (error, res, done) => {
    if (error) {
      return;
    } else {
      const { $ } = res;
      const hrefs = $("a")
        .map((i, elem) => $(elem).attr("href"))
        .get();
      const codes = $(".codes h1")
        .map((index, elem) => $(elem).text())
        .get();
      console.log(hrefs, codes);
      if (!minStr) {
        minStr = getMinStr(codes);
      } else {
        const tempResult = getMinStr(codes);
        minStr = minStr < tempResult ? minStr : tempResult;
      }
      if (hrefs) {
        hrefs.forEach(partialUrl => {
          that.queue(`http://localhost:${port}/${partialUrl}`);
        });
      } else {
        resolve(minStr);
        done();
      }
    }
  };
};
let strArray = [];
let minStr = null;

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * 29725
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    const crawlerInst = new nodeCrawler({
      maxConnections: 68,
      skipDuplicates: true,
      retryTimeout: 1000,
      callback: (error, res, done) => {
        if (error) {
          console.error(error);
          return;
        } else {
          const { $ } = res;
          const hrefs = $(".link")
            .map((i, elem) => $(elem).attr("href"))
            .get();
          // const codes = $("h1")
          //   .map((index, elem) => $(elem).text())
          //   .get();
          $(".codes h1").each((i, elem) => {
            strArray.push($(elem).text());
          });
          // console.log("finished one");

          // console.log(hrefs, codes, "testing");
          // if (minStr) {
          //   const tempResult = getMinStr(codes);
          //   minStr = minStr < tempResult ? minStr : tempResult;
          // } else {
          //   minStr = getMinStr(codes);
          // }
          if (hrefs && hrefs.length > 0) {
            hrefs.forEach(partialUrl => {
              // console.log(partialUrl, port, "ports...");
              const finalUrl = `${url}${partialUrl}`;
              // console.log(finalUrl);
              crawlerInst.queue(finalUrl);
            });
          }
        }
        // console.log("minStr", minStr);
        done();
      },
    });
    strArray = [];
    minStr = null;
    crawlerInst.queue(url);
    crawlerInst.on("drain", () => {
      strArray.sort();
      // console.log("my answer", strArray[0]);
      resolve(strArray[0]);
      // resolve(minStr);
    });
  });
