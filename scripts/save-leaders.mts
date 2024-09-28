import puppeteer from 'puppeteer'
import { raiseError } from './utils/common.mts'
import { loadCookiesIfExist } from './utils/cookies.mts'
import { sleep } from './utils/promises.mts'
import 'dotenv/config'

const twitterId =
  process.env.TWITTER_ID ?? raiseError('TWITTER_ID is not set.')

const browser = await puppeteer.launch({
  headless: false,
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1024 })
await loadCookiesIfExist(page)

page.on('console', (msg) => console.log('CONSOLE:', msg.text()))

await page.goto(`https://x.com/${twitterId}/following`)
if (page.url() === `https://x.com/${twitterId}`) {
  console.error('Please login first.')
  process.exit(1)
}

const usersList = await page.waitForSelector(
  '#react-root > div > div > div > main > div > div > div > div > div > section > div > div',
)
if (usersList === null) {
  throw new Error('usersList is null.')
}

await sleep(1000) // TODO: Don't use this
// const screenNames = await usersList.frame.$$(
//   'button[data-testid="UserCell"] > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(1) > [role="link"] > div > div:nth-child(1) > span',
// )
// if (screenNames.length === 0) {
//   throw new Error('screenNames is null.')
// }

// for (const screenName of screenNames) {
//   await screenName.evaluate((elem) => console.log(elem.textContent))
// }

// const twitterIds = await usersList.frame.$$(
//   'button[data-testid="UserCell"] > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > [role="link"] > div > div:nth-child(1) > span',
// )
// if (twitterIds.length === 0) {
//   throw new Error('twitterIds is null.')
// }
//
// for (const twitterId of twitterIds) {
//   await twitterId.evaluate((elem) => console.log(elem.textContent))
// }

const isFollowingMeList = await usersList.frame.$$(
  'button[data-testid="UserCell"] > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > span',
)
if (isFollowingMeList.length === 0) {
  throw new Error('isFollowingMe is null.')
}

for (const isFollowingMe of isFollowingMeList) {
  await isFollowingMe.evaluate((elem) => console.log(elem.textContent))
}

await browser.close()
