import puppeteer from 'puppeteer'
import { raiseError } from './utils/common.mts'
import { loadCookiesIfExist } from './utils/cookies.mts'
import 'dotenv/config'

const twitterId =
  process.env.TWITTER_ID ?? raiseError('TWITTER_ID is not set.')

const browser = await puppeteer.launch({
  headless: false,
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1024 })
await loadCookiesIfExist(page)

await page.goto(`https://x.com/${twitterId}/following`)
await page.waitForNavigation()
if (page.url() === `https://x.com/${twitterId}`) {
  console.error('Please login first.')
  process.exit(1)
}

// await browser.close()
