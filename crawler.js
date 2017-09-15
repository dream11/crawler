/**
 * Author: Vijay Soni (vs4vijay@gmail.com)
 */
'use strict'

const axios = require('axios');
// import axios from 'axios';

const config = {
  url: 'http://localhost:8080/'
};



async function getData(url) {
  return await axios.get(url)
    // .then(res => console.log('res', res))
    // .catch(err => console.log('err', err))
};

async function crawl() {
  const response = await axios.get(config.url);

  console.log('data', response.data);
  console.log(response.status);
  console.log(response.statusText);
  console.log(response.headers);
  console.log(response.config);
};


/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = crawl;
