// [1, 2, 3 ... N]
export const oneToN = n => Array.from(new Array(n), (_, i) => i + 1)

// rollNdS(N, S) returns the result of rolling N-many S-sided die
export const rollNdS = (numDie, numSides) => {
  let total = 0
  for (let i = 0; i < numDie; i++) {
    total += Math.floor(Math.random() * numSides) + 1
  }
  return total
}

