import puppeteer from 'puppeteer'


export async function main() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 })
  const page = await browser.newPage()

  await page.goto('https://www.scrapethissite.com/pages/frames/')

  const iframe = await getIframe(page, 'iframe')
  const turtleUrls = await collectTurtleUrls(iframe)

  const turtlesData = await scrapeTurtleData(browser, turtleUrls)
  const turtlesFormattedData = JSON.stringify(turtlesData, null, 2) // formatar o JSON de maneira legível

  await browser.close()

  return turtlesFormattedData
}


/**
 * Obtém o iframe correspondente a um seletor específico na página.
 *
 * @param {object} page - A instância da página do Puppeteer.
 * @param {string} selector - O seletor do elemento iframe.
 * @returns {Promise<object>} Uma promessa que resolve para o conteúdo do iframe.
 */
async function getIframe(page, selector) {
  const iframeElement = await page.waitForSelector(selector)
  return iframeElement.contentFrame() // transforma o elemento em um iframe
}

/**
 * Coleta URLs de tartarugas a partir de um iframe.
 *
 * @param {object} iframe - O iframe contendo os elementos das tartarugas.
 * @returns {Promise<string[]>} Uma promessa que resolve para uma lista de URLs das tartarugas.
 */
async function collectTurtleUrls(iframe) {
  const elements = await iframe.$$('.turtle-family-card') // extrai todos os elementos com a classe .turtle-family-card
  const urls = []

  for (const element of elements) {
    const learnMoreBtn = await element.$('.btn') // extrai o botão "Learn More"
    const href = await learnMoreBtn.evaluate((el) => el.getAttribute('href')) // extrai o link do botão
    urls.push(`https://www.scrapethissite.com${href}`)
  }

  return urls
}

/**
 * Raspa dados de tartarugas de uma lista de URLs.
 *
 * @param {object} browser - Instância do navegador Puppeteer.
 * @param {string[]} urls - Lista de URLs para raspar dados.
 * @returns {Promise<object[]>} - Uma promessa que resolve para uma lista de objetos contendo dados das tartarugas.
 */
async function scrapeTurtleData(browser, urls) {
  const data = []

  for (const url of urls) {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' }) // navega para a URL e espera até que o DOM seja carregado

    const turtleInfo = await extractTurtleData(page) // extrai os dados da tartaruga
    data.push(turtleInfo) // adiciona os dados ao array

    await page.close() // fecha a página
  }

  return data
}

async function extractTurtleData(page) {
  const name = await page.$eval('.family-name', (el) => el.textContent.trim()) // extrai o nome da tartaruga da classe .family-name e remove espaços em branco
  const description = await page.$eval('.lead', (el) => el.textContent.trim()) // extrai a descrição da tartaruga da classe .lead e remove espaços em branco
  const imageUrl = await page.$eval('.turtle-image', (el) => 
    el.getAttribute('src') // extrai o atributo src da imagem da tartaruga
  )

  return { species: name, description, imageUrl }
}
