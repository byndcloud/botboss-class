// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import { Frame, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

import ProgressBar from 'progress'

/**
 *
 * @returns {Promise<{ name: string, pictureUrl: string, description: string }[]>}
 */
export async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    // slowMo: 150,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--disable-notifications',
      '--window-size=1366,768',
      '--app-shell-host-window-size=1366,768',
      '--content-shell-host-window-size=1366,768',
      '--start-maximized'
    ]
  })

  const page = await browser.newPage()
  await page.goto('https://www.scrapethissite.com/pages/frames/')

  page.setDefaultTimeout(180_000)

  const frame = await extractIframe(page)
  const links = await getTurtleDetailsLinks(frame)

  const data = []

  const bar = new ProgressBar(':bar :current/:total', { total: links.length })

  for (const link of links) {
    const newPage = await browser.newPage()
    await newPage.goto(link)

    const turtleDetails = await extractTurtleDetails(newPage)

    data.push(turtleDetails)

    await newPage.close()
    bar.tick()
  }

  return data
}

/**
 *
 * @param {puppeteer.Page} page
 * @returns {Promise<Frame>}
 */
async function extractIframe(page) {
  const iframeElement = await page.waitForSelector('#iframe')
  return await iframeElement.contentFrame()
}

/**
 *
 * @param {puppeteer.Frame} frame
 * @returns {Promise<string[]>} array of links
 */
async function getTurtleDetailsLinks(frame) {
  return await frame.$$eval('a.btn', (elements) =>
    elements.map((link) => link.href)
  )
}

/**
 *
 * @param {puppeteer.Page} page
 * @returns {Promise<{ name: string, pictureUrl: string, description: string }>}
 */
async function extractTurtleDetails(page) {
  const pictureUrl = await page.$eval('.turtle-image', (img) => img.src)
  const name = await page.$eval('.family-name', (h3) => h3.textContent)
  const description = await page.$eval('.lead', (p) => p.textContent.trim())

  return { pictureUrl, name, description }
}
