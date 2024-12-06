import puppeteer from 'puppeteer'

async function main() {
    const url = 'https://www.olx.com.br/'
    const page = await setupPage(url)
    await closeCookiesDialog(page)

    await searchForTerm(page, 'apartamento') // digita "apartamento" no campo de busca

    // Extract data
    console.log('Extraindo dados dos anúncios')
    const ads = await fetchAdsFromPage(page)
    console.log('Número de anúncios encontrados:', ads.length)

    const adData = await processAdListings(ads)
    console.table(adData);

    // process.exit(0)
}

main().then()

/**
 * Processa uma lista de anúncios e extrai informações relevantes.
 *
 * @param {Array} ads - Lista de elementos de anúncios a serem processados.
 * @returns {Promise<Array<Object>>} Uma promessa que resolve para uma lista de objetos contendo título, preço, localização e link de cada anúncio.
 */
async function processAdListings(ads) {
    const data = []
    for (const ad of ads) {
        console.log(`Anúncio ${ads.indexOf(ad) + 1}/${ads.length}`)
        const title = await ad.$eval('h2.olx-ad-card__title', (el) => el.textContent?.trim())
        const price = await ad.$eval('.olx-ad-card__price', (el) => el.textContent?.trim())
        const location = await ad.$eval('.olx-ad-card__location p', (el) => el.textContent?.trim())
        const link = await ad.$eval('a.olx-ad-card__link-wrapper', (el) => el.href)

        data.push({ title, price, location, link })
    }

    return data
}

/**
 * Busca anúncios de uma página OLX.
 *
 * @param {object} page - A página do Puppeteer de onde os anúncios serão buscados.
 * @param {number} [maxAds=5] - O número máximo de anúncios a serem retornados.
 * @returns {Promise<Array>} Uma promessa que resolve para um array de elementos de anúncio.
 */
async function fetchAdsFromPage(page, maxAds = 50) {
    await page.waitForSelector('#total-of-ads') // espera que os anúncios sejam carregados
    const ads = await page.$$('section.olx-ad-card')
    return ads.slice(0, maxAds)
}

/**
 * Fecha o diálogo de cookies, se o botão "Fechar" estiver disponível.
 *
 * @param {object} page - A instância da página do Puppeteer.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando a ação é concluída.
 */
async function closeCookiesDialog(page) {
    // checa se o botão "Fechar" está disponível
    console.log('Checando se o botão "Fechar" está disponível')
    try {
        const element = await page.waitForSelector('div[role="dialog"] button') 
        await element.click() // clica no botão "Fechar"
    } catch (error) {
        console.log('Botão "Fechar" não encontrado')
    }
}

/**
 * Realiza uma busca por um termo específico na página.
 *
 * @param {object} page - A instância da página do Puppeteer.
 * @param {string} term - O termo a ser buscado.
 * @returns {Promise<void>} - Uma promessa que é resolvida quando a busca é concluída.
 */
async function searchForTerm(page, term) {
    console.log('Buscando por "apartamento"')
    await page.waitForSelector('input[role="combobox"]') // espera que os países sejam carregados
    await page.type('input[role="combobox"]', term)
    await page.click('div.olx-header__search > form > button')
}

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