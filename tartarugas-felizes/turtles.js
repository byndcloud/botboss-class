// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra'
import fs from 'fs/promises'

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

export async function main() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 })
  const page = await browser.newPage()

  const fileName = 'turtles-data.json'
  await ensureFileRemoved(fileName)

  await page.goto('https://www.scrapethissite.com/pages/frames/')
  page.setDefaultTimeout(180_000)

  const iframe = await getIframe(page, 'iframe')
  const turtleUrls = await collectTurtleUrls(iframe)

  const turtlesData = await scrapeTurtleData(browser, turtleUrls)
  const turtlesFormattedData = JSON.stringify(turtlesData, null, 2)

  await browser.close()

  return turtlesFormattedData
}

async function ensureFileRemoved(fileName) {
  try {
    await fs.access(fileName)
    await fs.unlink(fileName)
    console.log(`O arquivo "${fileName}" foi removido com sucesso!`)
  } catch {
    console.log(`O arquivo "${fileName}" não existe, pulando remoção.`)
  }
}

async function getIframe(page, selector) {
  const iframeElement = await page.waitForSelector(selector)
  return iframeElement.contentFrame()
}

async function collectTurtleUrls(iframe) {
  const elements = await iframe.$$('.turtle-family-card')
  const urls = []

  for (const element of elements) {
    const learnMoreBtn = await element.$('.btn')
    const href = await learnMoreBtn.evaluate((el) => el.getAttribute('href'))
    urls.push(`https://www.scrapethissite.com${href}`)
  }

  return urls
}

async function scrapeTurtleData(browser, urls) {
  const data = []

  for (const url of urls) {
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    const turtleInfo = await extractTurtleData(page)
    data.push(turtleInfo)

    await page.close()
  }

  return data
}

async function extractTurtleData(page) {
  const name = await page.$eval('.family-name', (el) => el.textContent.trim())
  const description = await page.$eval('.lead', (el) => el.textContent.trim())
  const imageUrl = await page.$eval('.turtle-image', (el) =>
    el.getAttribute('src')
  )

  return { species: name, description, imageUrl }
}
