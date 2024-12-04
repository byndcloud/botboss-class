
/**
 * Extrai e retorna o texto de um elemento HTML com base em um seletor CSS.
 *
 * @param {Element} element - O elemento HTML de onde o texto será extraído.
 * @param {string} selector - O seletor CSS usado para encontrar o elemento desejado.
 * @returns {string} O texto extraído do elemento encontrado, ou undefined se o elemento não for encontrado.
 *
 * @example
 * // '<div><span class="country">Brasil</span></div>';
 * const country = parseCountryElement(element, '.country');
 * console.log(country); // "Brasil"
 */
function parseCountryElement(element, selector) {
    return element.querySelector(selector)?.textContent.trim();
}


/**
 * Extrai dados do país a partir de um elemento HTML.
 *
 * @param {HTMLElement} element - O elemento HTML que contém os dados do país.
 * @returns {Object} Um objeto contendo os dados do país.
 * @returns {string} name - O nome do país.
 * @returns {string} capital - A capital do país.
 * @returns {string} population - A população do país.
 * @returns {string} area - A área do país.
 */
function extractCountryData(element) {
  const name = parseCountryElement(element, '.country-name')
  const capital = parseCountryElement(element, '.country-capital')
  const population = parseCountryElement(element, '.country-population')
  const area = parseCountryElement(element, '.country-area')

  return {
    name,
    capital,
    population,
    area,
  };
}

async function main() {
    const url = 'https://www.scrapethissite.com/pages/simple/'
    const page = await setupPage(url)
    await page.waitForSelector('section#countries') // espera que os países sejam carregados
    const countries = await page.$$eval('div.country', elements => elements.map(extractCountryData))
    console.table(countries)
}

main().then()

async function setupPage(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    return page
}
