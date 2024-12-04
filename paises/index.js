import puppeteer from 'puppeteer'

async function main() {
    const url = 'https://www.scrapethissite.com/pages/simple/'
    const page = await setupPage(url)
    await page.waitForSelector('section#countries') // espera que os países sejam carregados

    const countries = await page.$$eval('.country', (elements) => {
        return elements.map((el) => {
            function parseTextContent(element) { 
                return element?.textContent.trim();
            }

            const name = parseTextContent(el.querySelector('.country-name'))
            const capital = parseTextContent(el.querySelector('.country-capital'))
            const population = parseTextContent(el.querySelector('.country-population'))
            const area = parseTextContent(el.querySelector('.country-area'))

            return {
                name,
                capital,
                population,
                area,
            };
        });
    });

    console.table(countries)
}

main().then()

async function setupPage(url) {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(url)
    return page
}
