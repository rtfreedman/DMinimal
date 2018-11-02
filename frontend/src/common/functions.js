// [1, 2, 3, ..., 20]
export const initiativeRange = () => Array.from(new Array(50), (x, i) => i + 1)
export const oneToTwenty = () => Array.from(new Array(20), (x, i) => i + 1)

// rollNdS(N, S) returns the result of rolling N-many S-sided die
export const rollNdS = (numDie, numSides) => {
  let total = 0
  for (let i = 0; i < numDie; i++) {
    total += Math.floor(Math.random() * numSides) + 1
  }
  return total
}
