'use strict'

const fetch = require('node-fetch')

async function parsePage (url) {
  let response = await fetch(url)
  let data = await response.text()

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
  const promises = []
  let result

  const computeResults = (url) => new Promise((resolve, reject) => {
    if (urlsParsed[url]) resolve(undefined)

    urlsParsed[url] = true

    parsePage(`${domain}${url}`).then(
      ({ code, urls }) => {
        result = code ? (result < code ? result : code) : result

        console.log(Object.keys(urlsParsed).length)

        promises.push(urls.filter(i => !urlsParsed[i]).map(computeResults))
      }
    )
  })

  promises.push(computeResults(''))

  Promise.all(promises).then(i => {
    console.log(Object.keys(urlsParsed).length)
    resolve(result)
  })
})
