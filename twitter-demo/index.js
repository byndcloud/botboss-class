import { readFileSync } from 'fs'

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra'

// add stealth plugin and use defaults (all evasion techniques)
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
puppeteer.use(StealthPlugin())

;(async () => {
  const { password, username, email } = JSON.parse(
    readFileSync('./credentials.json', { encoding: 'utf8' })
  )

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 150,
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
  await page.goto('https://twitter.com/i/flow/login?redirect_after_login=%2F')

  page.setDefaultTimeout(180_000)

  await enterEmail(page, email)
  await checkAskForUsername(page, username)
  await enterPassword(page, password)

  const tweets = JSON.parse(readFileSync('./tweets.json', { encoding: 'utf8' }))

  for (const tweet of tweets) {
    await writeTweet(page, tweet)
    // await checkforAd(page)
  }
})()

/* Login */
async function enterEmail(page, email) {
  const inputElement = await page.waitForSelector('input')
  await inputElement.click()

  await page.keyboard.type(email)

  const nextButton = await page.waitForXPath('//span[contains(text(),"Next")]')
  await nextButton.click()
}

async function enterPassword(page, password) {
  const inputElement = await page.waitForSelector('input[name="password"]')
  await inputElement.click()

  await page.keyboard.type(password)

  const nextButton = await page.waitForXPath(
    '//span[contains(text(),"Log in")]'
  )
  await nextButton.click()
}

async function checkAskForUsername(page, username) {
  const searchText = 'There was unusual login'
  const xpath = `//span[contains(text(), "${searchText}")]`
  const matchingSpan = await page.$x(xpath)

  if (matchingSpan.length > 0) {
    console.log('Span with text exists:', searchText)
    const inputElement = await page.waitForSelector('input')
    await inputElement.click()

    await page.keyboard.type(username)

    const nextButton = await page.waitForXPath(
      '//span[contains(text(),"Next")]'
    )
    await nextButton.click()
    return true
  } else {
    return false
  }
}

/* Tweet */
async function writeTweet(page, tweet) {
  const inputElement = await page.waitForSelector(
    '[data-testid="tweetTextarea_0"]'
  )
  await inputElement.click()

  await page.keyboard.type(tweet.content)

  const tweetButton = await page.waitForSelector(
    '[data-testid="tweetButtonInline"]'
  )
  await tweetButton.click()
}

async function checkforAd(page) {
  const xpath = `'//span[contains(text(),"Got it")]'`
  const matchingSpan = await page.$x(xpath)

  if (matchingSpan.length > 0) {
    console.log('Ad popup')
    await matchingSpan[0].click()
    return true
  } else {
    return false
  }
}
