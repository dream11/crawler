/**
 * Created by tushar on 11/09/17.
 */

const express = require('express')

const path = require('path')
const RateLimit = require('express-rate-limit')

exports.start = ({port, graph}) =>
  new Promise(resolve => {
    const app = express()
    const firstNode = Object.values(graph)[0]

    app.set('view engine', 'pug')
    app.set('views', path.resolve(__dirname, './views'))
    app.use(express.static('public'))
    app.use(
      new RateLimit({
        windowMs: 10000, // window size
        delayAfter: 250, // time after which the responses will be slowed down
        delayMs: 100, // delay per request
        max: 500, // request count after which 429 response is triggered
        message: 'Seriously slow down your crawler bro!'
      })
    )
    app.get('/', (req, res) =>
      res.render('index', {cache: true, node: firstNode})
    )
    app.get('/:hash', (req, res, next) => {
      const node = graph[req.params.hash]
      if (node) res.render('index', {cache: true, node})
      else next()
    })

    const server = (app.listen(port, () => {
      console.log(`Server started — http://localhost:${port}`)
      resolve(server)
    }))
  })

exports.stop = (app) => new Promise(resolve => app.close(resolve))

if(process.argv[2] === 'start') {
  exports.start({port: 8080, graph: require('./public/graph.json')})
}
