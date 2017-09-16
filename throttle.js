let queue = []

module.exports = (func) => {
  queue.push(func)
}

setInterval(() => {
  for (let i = 0; i < 120; i++) queue.length > 0 && queue.shift()()
}, 1000)

setInterval(() => {
  for (let i = 0; i < 10; i++) queue.length > 0 && queue.shift()()
}, 100)
