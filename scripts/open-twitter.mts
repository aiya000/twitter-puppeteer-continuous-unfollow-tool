import puppeteer from 'puppeteer'
import { loadCookiesIfExist } from './utils/cookies.mts'

const browser = await puppeteer.launch({
  headless: false,
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1024 })
await loadCookiesIfExist(page)
await page.goto('https://x.com')
