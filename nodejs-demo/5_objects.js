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

