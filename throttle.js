let maxLimit = 400
let currentLimit = maxLimit
let lastReset = Date.now()

let queue = []

const consume = () => {
  while (currentLimit >= 0 && queue.length > 0) {
    currentLimit--
    queue.shift()()
  }
}

const resetLimits = (hardReset = false) => {
  lastReset = Date.now()

  if (hardReset) {
    currentLimit = maxLimit = 400
  } else {
    currentLimit = maxLimit
    maxLimit = maxLimit <= 250 ? 400 : (maxLimit - 50)
  }
}

setInterval(() => lastReset + 10000 < Date.now() && resetLimits(), 100)
setInterval(consume, 10)

const throttle = (func) => queue.push(func)

module.exports = {
  throttle,
  resetLimits
}
