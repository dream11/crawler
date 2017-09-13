/**
 * Created by tushar on 12/09/17.
 */

;('use strict')

const assert = require('assert')
const graph4 = require('../public/graph-4.json')
const graph100 = require('../public/graph-100.json')
const graph1000 = require('../public/graph-1000.json')
const {startServer, stopServer} = require('../lib')

const crawl = require('../crawler')

describe('crawler', function() {
  this.timeout(60 * 1000)
  context('for website with 1000 pages', () => {
    beforeEach(async function() {
      this.server = await startServer({port: 8081, graph: graph1000, delay: 10})
    })
    afterEach(async function() {
      await stopServer(this.server)
    })

    it('should return the lexicographically smallest string', async function() {
      const actual = await crawl('http://localhost:8081')
      const expected = 'bcdgjv'
      assert.strictEqual(actual, expected)
    })
  })

  context('for a website with 100 pages', () => {
    beforeEach(async function() {
      this.server = await startServer({port: 8083, graph: graph100, delay: 10})
    })
    afterEach(async function() {
      await stopServer(this.server)
    })

    it('should return the lexicographically smallest string', async function() {
      const actual = await crawl('http://localhost:8083')
      const expected = 'bcepfg'
      assert.strictEqual(actual, expected)
    })
  })
  context('for a website with 4 pages', () => {
    beforeEach(async function() {
      this.server = await startServer({port: 8082, graph: graph4, delay: 10})
    })
    afterEach(async function() {
      await stopServer(this.server)
    })

    it('should return the lexicographically smallest string', async function() {
      const actual = await crawl('http://localhost:8082')
      const expected = 'bfrvow'
      assert.strictEqual(actual, expected)
    })
  })
})
