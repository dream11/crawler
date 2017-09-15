'use strict'

const { throttle } = require('lodash')
const { get } = require('axios')

async function parsePage (url) {
  let { data } = await get(url)
  data = data.slice(264, -96)

  let code
  let urls = []

  while (data.slice(-5) === '</h1>') {
    let currentCode = data.slice(-11, -5)

    code = code < currentCode ? code : currentCode

    data = data.slice(0, -15)
  }

  while (data[1] !== '/') {
    urls.push(data.slice(39, 72))

    data = data.slice(88)
  }

  return { code, urls }
}

module.exports = url => new Promise((resolve, reject) => {
  const urlsParsed = {}
  const domain = url
  let result

  const computeResults = throttle((url) => new Promise((resolve, reject) => {
    if (urlsParsed[url]) resolve(undefined)

    urlsParsed[url] = true

    parsePage(`${domain}${url}`).then(
      ({ code, urls }) => {
        result = code ? (result < code ? result : code) : result

        console.log(result)

        Promise.all(urls.filter(i => !urlsParsed[i]).map(computeResults)).then(i => resolve())
      }
    )
  }), 1)

  Promise.all([computeResults('')]).then(i => resolve(result), i => console.log('Error'))
})
