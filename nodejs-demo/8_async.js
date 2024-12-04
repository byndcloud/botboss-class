// async await 
import { writeFile, readFile } from 'fs/promises'
import * as emoji from 'node-emoji'

async function functionWithAsyncCode() {
    const loveCoffeWithEmojis = emoji.emojify('I :heart:  :coffee:!')
    await writeFile('loveCoffee.txt', loveCoffeWithEmojis)
    const fileContent = await readFile('loveCoffee.txt', 'utf-8')
    console.log(fileContent)
}


functionWithAsyncCode().then()
