/**
 * Created by tushar on 13/09/17.
 */

'use strict'

const axios = require('axios')
const cheer = require('cheerio')
const debug = require('debug')('crawler')

function promisify(fn, delay = 0) {
  return new Promise(resolve => 
    setTimeout(() => {
      const result = fn()

      if (result instanceof Promise) 
        result.then(any => resolve(any))
      else resolve(result)
    }, Math.max(0, delay))
  )
}

async function map($, selector, cb) {
  return await promisify(
    () => $(selector).map((_, v) => cb($(v))).get()
  )
}

async function parse (content) {
  const $ = await promisify(() => cheer.load(content))

  return {
    links: map($, 'a', el => el.attr('href')),
    words: map($, '.codes h1', el => el.text())
  }
}

function smallest (words, start) {
  return words.reduce((r, a) => (a && a < r) ? a : r, start || words[0])
}

function stripLeadingAndTrailingSlashes(any) {
  return any.replace(/^\/|\/$/g, '')
}

function extractBasePath(url) {
  const length = url.indexOf('/', 8)

  if (length == -1)  return url

  return url.substr(0, length)
}

function normalizeUrl(base, url, path) {
  if (path.startsWith('/')) {
    return base + path
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return path
  }

  return url + '/' + path
}

function normalizeUrls(url, paths) {
  const base = stripLeadingAndTrailingSlashes(extractBasePath(url))
  url = stripLeadingAndTrailingSlashes(url)

  return paths.map(path => stripLeadingAndTrailingSlashes(normalizeUrl(base, url, path)))
}

async function fetch (url, retry = 1) {
  // debug (`Fetch ${url}...`)
  try {
    const response = await axios(url)
    const { words, links } = await parse(response.data)
  
    return {
      urls: normalizeUrls(url, await links),
      words: await words,
      headers: response.headers
    }
  } catch (e) {
    if (retry < 3) return fetch (url, retry + 1)

    throw e
  }
}

async function crawl(url, resolve) {
  const queue = [url]
  const throttle = {
    limit: 500,
    timestamp: 0,
    remaining: 500,
  }
  const config = {
    limit: 10000,
    slowdownLimit: 250,
    waitover: 100,
    parallelism: 100
  }
  const status = {
    pending: 0,
    startedAt: 0,
    waiting: -1
  }
  const history = {}
  const started = Date.now()
  let i = 0
  let target = undefined

  function collect (result) {
    if (result.urls.length) {
      result.urls.forEach(url => {
        if (url in history) return
        // debug(`Found new url -> ${url}`)
        history[url] = true
        queue.push(url)
      })
    }
    if (result.words.length) {
      target = smallest(result.words, target)
      // debug (`Current result "${target}"`)
    }
    
    throttle.remaining = Number(result.headers['x-ratelimit-remaining'])
    throttle.limit = Number(result.headers['x-ratelimit-limit'])
    throttle.timestamp = Date.now()

    status.pending -= 1

    dispatch()
  }

  function dispatch () {
    if (!queue.length) {
      if (status.pending > 0) return
      debug(`No urls left. Result is "${target}" in ${(Date.now() - started) / 1000}s with ${i} requests.`)
      return resolve(target)
    }

    if (throttle.limit === throttle.remaining) {
      // debug(`Reset request count window.`)
      status.startedAt = Date.now()
    }
    
    const spent = throttle.limit - throttle.remaining

    if (throttle.remaining === 0) {
      const wait = config.limit - (Date.now() - status.startedAt)

      // debug(`Used all requests. Wait for ${wait} ms.`)

      assert(wait > -1)

      clearTimeout(status.waiting)
      status.waiting = setTimeout(() => dispatch(), wait)

      return
    }

    if (spent > config.slowdownLimit) {
      // debug(`These requests would face slowdown. ${spent} of ${throttle.limit}`)
      const timeElapsed = Date.now() - status.startedAt
      const timeRemaining = config.limit - timeElapsed

      if (timeRemaining > 0 && timeRemaining < config.waitover) {
        // debug(`It's better to wait for ${timeRemaining}ms then sending a request now.`)
        clearTimeout(status.waiting)
        status.waiting = setTimeout(() => dispatch(), timeRemaining)

        return
      }
    }

    const size = Math.min(throttle.remaining, config.parallelism - status.pending)
    // debug(`Sending ${size} requests of ${queue.length}.`)

    const requests = queue.splice(0, size)

    i += requests.length
    status.pending += requests.length
    requests.map(
      request => fetch(request).then(collect).catch(
        e => {
          if (e.status && e.status > 400) {
            debug(`Retry again!`)
            queue.push(request)
          } else {
            console.error(e)
          }
        }
      )
    )
  }

  // --> start it.
  dispatch()
}

// trigger rebuild :p

/**
 * Crawls a website using a start {url}, and returns the lexicographically smallest string.
 * @param url
 * @return {Promise.<string>}
 */
module.exports = url =>
  new Promise((resolve, reject) => {
    try {
      crawl(url, resolve)
    } catch (e) {
      reject(e)
    }
  })
