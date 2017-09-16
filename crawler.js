/**
 * Created by tushar on 13/09/17.
 */

'use strict'

const O = require('observable-air')
const promiseRetry = require('promise-retry')
const axios = require('axios')
const {JSDOM} = require('jsdom')
const R = require('ramda')

const requestRetry = url => promiseRetry(retry => axios.get(url).catch(retry))

const request$ = url => O.fromPromise(() => requestRetry(url))
const extractDOM = R.compose(
  R.path(['window', 'document']),
  R.construct(JSDOM),
  R.prop('data')
)
const querySelectorAll = R.curry((selector, doc) =>
  Array.from(doc.querySelectorAll(selector))
)
const extractCodes = R.compose(
  O.fromArray,
  R.pluck('innerHTML'),
  querySelectorAll('h1')
)
const extractLinks = R.compose(
  O.fromArray,
  R.pluck('href'),
  querySelectorAll('a')
)

const crawl = R.curry((base, unique, url) => {
  const response$ = O.multicast(request$(url))
  const document$ = O.map(extractDOM, response$)
  const code$ = O.flatMap(extractCodes, document$)
  const link$ = O.map(R.concat(base), O.flatMap(extractLinks, document$))
  return O.merge(code$, O.flatMap(crawl(base, unique), unique(link$)))
})

const findMin = source =>
  O.reduce(
    (last, current) => (current < last ? current : last),
    'zzzzzzzz',
    source
  )

const main = url => findMin(crawl(url, O.uniqueWith(new Set()), url))

module.exports = url => {
  return new Promise(resolve => O.forEach(result => resolve(result), main(url)))
}
