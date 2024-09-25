import puppeteer, { Page } from 'puppeteer'
import { loadCookiesIfExist, saveCookies } from './utils/cookies.mts'
import { raiseError } from './utils/common.mts'
import parseArgs from 'args-parser'
import { z } from 'zod'
import { ensureValueOf } from './utils/zod.mts'
import 'dotenv/config'

/**
 * Returns an Error if CLI arguments are illegal.
 */
const pullOptionalTwofaCode = (): string | undefined => {
  const argsSchema = z.object({
    '2fa': z.string().optional(),
  })

  const args: unknown = parseArgs(process.argv)
  try {
    console.log(args)
    ensureValueOf(argsSchema, args)
  } catch (_e) {
    console.error('Illegal CLI arguments.')
    process.exit(1)
  }
  return args['2fa']
}

// TODO: Implement
const isTwofaCodeRequired = async (_page: Page): Promise<boolean> => true

const twoFaCode = pullOptionalTwofaCode()
const twitterId =
  process.env.TWITTER_ID ?? raiseError('TWITTER_ID is not set.')
const twitterPassword =
  process.env.TWITTER_PASSWORD ?? raiseError('TWITTER_PASSWORD is not set.')

const browser = await puppeteer.launch({
  headless: false,
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1024 })
await loadCookiesIfExist(page)

await page.goto('https://x.com/i/flow/login', { waitUntil: 'networkidle2' })

const usernameInput = await page.waitForSelector(
  'xpath/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/div[4]/label/div/div[2]/div/input',
)
await usernameInput?.type(twitterId)

const nextButton = await page.waitForSelector(
  'xpath/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div/div/div/button[2]',
)
await nextButton?.click()

const passwordInput = await page.waitForSelector(
  'xpath/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div/div[3]/div/label/div/div[2]/div[1]/input',
)
await passwordInput?.type(twitterPassword)

const loginButton = await page.waitForSelector(
  'xpath/html/body/div/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div[1]/div/div/button',
)
await loginButton?.click()

if (await isTwofaCodeRequired(page)) {
  const twofaCodeInput = await page.waitForSelector(
    'xpath/html/body/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[2]/label/div/div[2]/div/input',
  )
  await twofaCodeInput?.type(
    twoFaCode ??
      raiseError('Required 2FA Code by X, but 2fa code is not taken.'),
  )

  const twofaNextButton = await page.waitForSelector(
    'xpath/html/body/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/button',
  )
  await twofaNextButton?.click()
} else {
  console.error(
    'Sorry. Currently accounts without 2FA are not supported, because development is difficult by Twitter spam filtering. I am waiting for your PR.',
  )
  process.exit(1)
}

await saveCookies(page)
// await browser.close()
