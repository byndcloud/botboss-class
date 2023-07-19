import { main } from "./turtles.js"

import { writeFileSync } from 'fs'

(async () => {
  const turtles = await main()

  writeFileSync('./output.json', JSON.stringify(turtles))
  process.exit(0)
})()