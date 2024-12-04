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

// loop em cada chave do objeto fifaCupWinners (brasil, alemanha, itália, etc.)
for (const country in fifaCupWinners) {
  const wins = fifaCupWinners[country] // acessa o valor associado à chave country no objeto fifaCupWinners (fifaCupWinners['brasil'] = 5)
  console.log(`${country} ganhou ${wins} copas`) // printf do javascript
}

