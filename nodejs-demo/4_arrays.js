/* Arrays */
const array = [0, 1, 2, 3, 4]
let sum = 0
for (let i = 0; i < array.length; ++i) {
  sum += array[i]
}
console.log(`Sum of array = ${sum}`)

const double = array.map((x) => x * 2)
console.log(`Double of the array`,  double )