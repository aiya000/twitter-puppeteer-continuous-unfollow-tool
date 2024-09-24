import puppeteer from 'puppeteer'
import { loadCookiesIfExist, saveCookies } from './utils.mts'
import config from '../config.json'

export const login = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
  })
  const page = await browser.newPage()

  await page.setViewport({ width: 1080, height: 1024 })
  await loadCookiesIfExist(page)

  await page.goto('https://x.com')
  console.log('Please login manually.')
  console.log('Close Browser when you logged in.')
  browser.on('disconnected', async () => {
    await saveCookies(page)
    console.log('Cookies saved.')
  })
}
