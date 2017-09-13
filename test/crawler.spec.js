/**
 * Created by tushar on 12/09/17.
 */

;('use strict')

const assert = require('assert')
const crawl = require('../crawler')

/**
 * crawl() is being tested for correctness
 */
async function main() {
  const time = Date.now()

  const actual = await crawl('http://localhost:8080')
  const expected = 'bcgsqo'
  assert.strictEqual(actual, expected)

  console.log('ok!')
  console.log(`Total Time: ${(Date.now() - time) / 1000}s`)
}

main().catch(err => {
  throw err
})
