import { readFileSync } from 'fs'
import puppeteer from 'puppeteer-extra';
import { default as RecaptchaPlugin, BuiltinSolutionProviders } from 'puppeteer-extra-plugin-recaptcha';
import CapMonsterProvider from 'puppeteer-extra-plugin-recaptcha-capmonster';

CapMonsterProvider.use(BuiltinSolutionProviders);

;(async () => {
	const { key } = JSON.parse(
    readFileSync('./credentials.json', { encoding: 'utf8' })
  );
	console.log(key)
	puppeteer.use(
		RecaptchaPlugin({
			provider: {
				id: "capmonster",
				token: key // REPLACE THIS WITH YOUR OWN CAPMONSTER API KEY ⚡
			},
			visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
		})
	);
	const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });
  	const page = await browser.newPage();
	await page.goto("https://www.google.com/recaptcha/api2/demo");

	// That's it, a single line of code to solve reCAPTCHAs 🎉
	await page.waitForSelector("#recaptcha-demo");
	await sleep(2000)
	const frames = await page.frames()
	for (const frame of frames) {
		console.log(await frame.title())
		try {
			const submit = await frame.$('.recaptcha-checkbox-border')
			await submit?.click()
		} catch (error) {
			console.log(error)
			console.log('não encontrou submit')
		}
	}
	await sleep(4000)
	await page.solveRecaptchas();
	await sleep(3000)
	await Promise.all([page.waitForNavigation(), page.click(`#recaptcha-demo-submit`)]);
	await page.screenshot({ path: "response.png", fullPage: true });
	await sleep(30000)
	await browser.close();
})();

const sleep = (ms) => {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms))
}