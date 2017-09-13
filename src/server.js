/**
 * Created by tushar on 11/09/17.
 */

const {startServer} = require('./lib')

/**
 * You can import other options such as `graph-100` or `graph-1000`
 */
const graph = require('../public/graph-1000.json')
const port = 8080

startServer({port, graph, delay: 1000}).then(() =>
  console.log(`Server started —\nhttp://localhost:${port}`)
)
