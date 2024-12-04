/* Loops */
let n = 1
for (let i = 1; i < 10; ++i) {
  n = n * i
  console.log(`f( ${i} ) = ${n}`)
}

let i = 1
n = 1
while (i < 10) {
  n *= i
  console.log(`f( ${i++} ) = ${n}`)
}

