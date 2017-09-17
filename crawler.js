const throttle = require('./throttle')
const { get } = require('axios')

const parsePage = (page) => {
  page = page.slice(264, -96)

  let code
  let urls = []

  while (page.slice(-5) === '</h1>') {
    let currentCode = page.slice(-11, -5)

    code = code < currentCode ? code : currentCode

    page = page.slice(0, -15)
  }

  while (page[1] !== '/') {
    urls.push(page.slice(39, 72))

    page = page.slice(88)
  }

  return { urls, code }
}

module.exports = startUrl => new Promise((resolve) => {
  const domain = startUrl
  const parsedPages = {}

  let result
  // let count = 0

  const processUrl = (url) => new Promise((resolve, reject) => {
    if (parsedPages[url]) { resolve(); return }

    parsedPages[url] = true

    throttle(() => get(`${domain}${url}`).then(({ data }) => {
      const { urls, code } = parsePage(data)

      result = code ? (result < code ? result : code) : result

      // console.log(result, url, code, count++)

      Promise
        .all(urls.filter(url => !parsedPages[url]).map(processUrl))
        .then(i => resolve())
    }).catch(i => {
      parsedPages[url] = false
      processUrl(url, false).then(i => resolve())
    }))
  })

  processUrl('').then(i => resolve(result))
})
