// [1, 2, 3, ..., 20]
export const oneToTwenty = () => Array.from(new Array(20), (x, i) => i + 1)

// roll an N-sided dice
export const roll = numSides => Math.floor(Math.random() * numSides) + 1
