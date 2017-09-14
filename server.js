/**
 * Created by tushar on 11/09/17.
 */

const express = require('express')
const graph = require('./public/graph.json')
const path = require('path')
const RateLimit = require('express-rate-limit')

const app = express()
const port = 8080
const firstNode = Object.values(graph)[0]

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, './views'))
app.use(express.static('public'))
app.use(
  new RateLimit({
    windowMs: 10000, // 10 seconds window
    delayAfter: 250, // begin slowing down responses after 250 requests
    delayMs: 100, // slow down subsequent responses by a 100ms per request
    max: 500, // start blocking after 500 requests
    message: 'Seriously slow down your crawler bro!'
  })
)
app.get('/', (req, res) => res.render('index', {cache: true, node: firstNode}))
app.get('/:hash', (req, res, next) => {
  const node = graph[req.params.hash]
  if (node) res.render('index', {cache: true, node})
  else next()
})

module.exports = app.listen(port, () =>
  console.log(`Server started — http://localhost:${port}`)
)
