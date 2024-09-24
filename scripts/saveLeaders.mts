import puppeteer from 'puppeteer'
import { loadCookiesIfExist, saveCookies } from './utils.mts'
import config from '../config.json'

export const saveLeaders = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1080, height: 1024 })
  await loadCookiesIfExist(page)

  try {
    const twitterId = config.username
    await page.goto(`https://x.com/${twitterId}/following`)
    await page.waitForNavigation()
    if (page.url() === `https://x.com/${twitterId}`) {
      console.error('Please login first.')
      process.exit(1)
    }
  } finally {
    await saveCookies(page)
  }

  await browser.close()
}
