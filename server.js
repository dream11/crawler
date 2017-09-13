/**
 * Created by tushar on 11/09/17.
 */

const express = require('express')
const graph = require('./public/graph.json')
const path = require('path')

const app = express()
const port = 8080
const delay = 1000
const firstNode = Object.values(graph)[0]

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, './views'))
app.use(express.static('public'))
app.get('/', (req, res) => res.render('index', {cache: true, node: firstNode}))
app.get('/:hash', (req, res, next) => {
  const node = graph[req.params.hash]
  if (node) setTimeout(() => res.render('index', {cache: true, node}), delay)
  else next()
})

module.exports = app.listen(port, () =>
  console.log(`Server started — http://localhost:${port}`)
)
