
async function main() {
    const url = 'https://www.scrapethissite.com/pages/simple/'
    const page = await setupPage(url)
    await page.waitForSelector('section#countries') // espera que os países sejam carregados



}

main().then()

async function setupPage(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    return page
}


async function parseCountryDiv(div) {
    const title = 



}