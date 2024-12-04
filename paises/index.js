import puppeteer, { ElementHandle } from 'puppeteer'

async function main() {
    const url = 'https://www.scrapethissite.com/pages/simple/'
    const page = await setupPage(url)
    await page.waitForSelector('section#countries') // espera que os países sejam carregados

    const countries = await page.$$('.country') // extrai todos os elementos com a classe .country
    const data = await getAllCountriesInfos(countries)

    console.table(data)
    process.exit(0)
}

main().then()


/**
 * Configura uma nova página do navegador e navega para a URL especificada.
 *
 * @param {string} url - A URL para a qual a página deve navegar.
 * @returns {Promise<import('puppeteer').Page>} Uma promessa que resolve para a nova página do navegador.
 */
async function setupPage(url) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)
    return page
}

/**
 * Extrai informações de um único país a partir de um elemento DOM.
 *
 * @param {ElementHandle} countryElement - O elemento DOM que contém as informações do país.
 * @returns {Promise<Object>} Um objeto contendo o nome, capital, população e área do país.
 * @property {string} name - O nome do país.
 * @property {string} capital - A capital do país.
 * @property {string} population - A população do país.
 * @property {string} area - A área do país.
 */
async function parseSingleCountryInfo(countryElement) {
    const name = await countryElement.$eval('.country-name', (el) => el.textContent.trim())
    const capital = await countryElement.$eval('.country-capital', (el) => el.textContent.trim())
    const population = await countryElement.$eval('.country-population', (el) => el.textContent.trim())
    const area = await countryElement.$eval('.country-area', (el) => el.textContent.trim())

    return { name, capital, population, area }
}


/**
 * Obtém informações de todos os países fornecidos.
 *
 * @param {ElementHandle[]} countryElements - Uma lista de nomes de países.
 * @returns {Promise<Object[]>} Uma promessa que resolve para uma lista de objetos contendo informações dos países.
 */
async function getAllCountriesInfos(countryElements) {
    const data = []

    for (const country of countryElements) {
        const countryData = await parseSingleCountryInfo(country)

        data.push(countryData)
    }
    return data
}


