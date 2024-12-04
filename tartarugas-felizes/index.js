import { main } from "./turtles.js"

import { writeFileSync } from 'fs'

(async () => {
  const turtles = await main()

  writeFileSync("turtles-data.json", turtles)
  process.exit(0)
})()