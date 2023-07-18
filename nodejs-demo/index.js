/* Variáveis */
const a = 10 // constante
let b = 10 // variável
b = a + b // nova atribuição
console.log('a =', a) // printf do javascript
console.log('b =', b) // printf do javascript

/* If-Else */
if (a > b) {
  console.log('a > b')
} else if (a == b) {
  console.log('a == b')
} else {
  console.log('a < b')
}

/* Loops */
let n = 1
for (let i = 1; i < 10; ++i) {
  n = n * i
  console.log(`f( ${i} ) = ${n}`)
}

let i = 1
n = 1
while (n < 100) {
  n *= i
  console.log(`f( ${i++} ) = ${n}`)
}

/* Arrays */
const array = [0, 1, 2, 3, 4]
let sum = 0
for (let i = 0; i < array.length; ++i) {
  sum += array[i]
}
console.log(`Sum of array = ${sum}`)

/* Objects */
const fifaCupWinners = {
  brasil: 5,
  alemanha: 4,
  itália: 4,
  argentina: 3,
  frança: 2,
  uruguai: 2,
  espanha: 1,
  inglaterra: 1
}

for (const country in fifaCupWinners) {
  const wins = fifaCupWinners[country]
  console.log(`${country} ganhou ${wins} copas`)
}

/* Funções */
function isOdd(number) {
  return number % 2 !== 0 // strict equality, testa o tipo e o valor
}

console.log(0 == false) // true
console.log(0 === false) // false
