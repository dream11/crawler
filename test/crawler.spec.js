/**
 * Created by tushar on 12/09/17.
 */

;('use strict')

const {start, stop} = require('../server')
const assert = require('assert')
const crawl = require('../crawler')
const OneMin = 60 * 1000
const port = 8081

/**
 * crawl() is being tested for correctness
 */

describe('graph.json', function() {
  before(async function() {
    this.server = await start({
      port: port,
      graph: require('../public/graph.json')
    })
  })
  after(async function() {
    await stop(this.server)
  })
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcgsqo'
    assert.strictEqual(actual, expected)
  })
})

describe('graph-0.json', function() {
  before(async function() {
    this.server = await start({
      port: port,
      graph: require('../public/graph-0.json')
    })
  })
  after(async function() {
    await stop(this.server)
  })
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcdzme'
    assert.strictEqual(actual, expected)
  })
})

describe('graph-1.json', function() {
  before(async function() {
    this.server = await start({
      port: port,
      graph: require('../public/graph-1.json')
    })
  })
  after(async function() {
    await stop(this.server)
  })
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcdtnk'
    assert.strictEqual(actual, expected)
  })
})

describe('graph-2.json', function() {
  before(async function() {
    this.server = await start({
      port: port,
      graph: require('../public/graph-2.json')
    })
  })
  after(async function() {
    await stop(this.server)
  })
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcifrp'
    assert.strictEqual(actual, expected)
  })
})

describe('graph-3.json', function() {
  before(async function() {
    this.server = await start({
      port: port,
      graph: require('../public/graph-3.json')
    })
  })
  after(async function() {
    await stop(this.server)
  })
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcehmk'
    assert.strictEqual(actual, expected)
  })
})
