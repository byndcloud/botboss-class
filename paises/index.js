import puppeteer from 'puppeteer'

async function main() {
    const url = 'https://www.scrapethissite.com/pages/simple/'
    const page = await setupPage(url)
    await page.waitForSelector('section#countries') // espera que os países sejam carregados

    const countries = await page.$$eval('.country', (elements) => {
        return elements.map((el) => {
        const name = el.querySelector('.country-name')?.textContent.trim();
        const capital = el.querySelector('.country-capital')?.textContent.trim();
        const population = el.querySelector('.country-population')?.textContent.trim();
        const area = el.querySelector('.country-area')?.textContent.trim();

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
