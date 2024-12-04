// async await 
import { writeFile, readFile } from 'fs/promises'
import * as emoji from 'node-emoji'

async function functionWithAsyncCode() {
    const loveCoffeWithEmojis = emoji.emojify('I :heart:  :coffee:!')
    await writeFile('loveCoffee.txt', loveCoffeWithEmojis) // escreve o conteúdo no arquivo
    const fileContent = await readFile('loveCoffee.txt', 'utf-8') // lê o conteúdo do arquivo
    console.log(fileContent)
}


functionWithAsyncCode().then()
