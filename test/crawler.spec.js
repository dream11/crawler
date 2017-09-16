/**
 * Created by tushar on 12/09/17.
 */

;('use strict')

const port = (process.env.PORT = process.env.PORT || 8081)

const {start, stop} = require('../server')
const assert = require('assert')
const crawl = require('../crawler')
const OneMin = 60 * 1000

/**
 * crawl() is being tested for correctness
 */

describe('string-factory.com', () => {
  beforeEach(async () => await start)
  afterEach(async () => await stop)
  it('crawl()', async function() {
    this.timeout(OneMin)
    const actual = await crawl(`http://localhost:${port}`)
    const expected = 'bcgsqo'
    assert.strictEqual(actual, expected)
  })
})
