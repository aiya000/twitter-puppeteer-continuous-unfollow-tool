import puppeteer, { Page } from 'puppeteer'
import { loadCookiesIfExist, saveCookies } from './utils/cookies.mts'
import { sleep } from './utils/promises.mts'
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
    '2fa': z.number().or(z.string()).optional(), // NOTE: This is `number | string` because the type depends on the moment. Why?
  })

  const args: unknown = parseArgs(process.argv)
  try {
    ensureValueOf(argsSchema, args)
  } catch (_e) {
    console.error('Illegal CLI arguments.')
    process.exit(1)
  }
  return args['2fa'] === undefined ? undefined : String(args['2fa'])
}

// TODO: Implement
const isTwofaCodeRequired = async (_page: Page): Promise<boolean> => true

// TODO: This is not working correctly
const isStilOnTwofaRequiringPage = async (
  page: Page,
  twofaNextButtonXpath: string,
): Promise<boolean> =>
  await Promise.race([
    (async () => {
      await page.waitForSelector(twofaNextButtonXpath, { timeout: 40000 })
      return true
    })(),
    (async () => {
      await sleep(5000) // 5000 must be a number less than above 40000
      return false
    })(),
  ])

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

if (!(await isTwofaCodeRequired(page))) {
  console.error(
    'Sorry. Currently accounts without 2FA are not supported, because development is difficult by Twitter spam filtering. I am waiting for your PR.',
  )
  process.exit(1)
}

const twofaCodeInput = await page.waitForSelector(
  'xpath/html/body/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/div[2]/label/div/div[2]/div/input',
)
await twofaCodeInput?.type(
  twoFaCode ?? raiseError('Required 2FA Code by X, but 2fa code is not taken.'),
)

const twofaNextButtonXpath =
  'xpath/html/body/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/div/div/button'
const twofaNextButton = await page.waitForSelector(twofaNextButtonXpath)
await twofaNextButton?.click()

if (await isStilOnTwofaRequiringPage(page, twofaNextButtonXpath)) {
  // TODO: Here is not enough to test because Twitter spam filtering. Test this if I can. Please also see `isStilOnTwofaRequiringPage` definition
  console.error('2FA code is wrong.')
  process.exit(1)
}

await saveCookies(page)
await browser.close()

console.log('Success.')
