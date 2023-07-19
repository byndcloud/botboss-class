import { main } from './turtles.js'
import express from 'express'

const app = express()
const PORT = 3000

app.get('/turtles', async (request, response) => {
  try {
    const result = await main()
    response.status(200).json(result)
  } catch (error) {
    response
      .status(500)
      .json({ error: 'An error occurred while fetching data.' })
  }
})

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
