import puppeteer from 'puppeteer'
import { raiseError } from './utils/common.mts'
import { loadCookiesIfExist } from './utils/cookies.mts'
import { sleep } from './utils/promises.mts'
import { TwitterInfo } from './models/TwitterInfo.mts'
import 'dotenv/config'

const twitterId =
  process.env.TWITTER_ID ?? raiseError('TWITTER_ID is not set.')

const browser = await puppeteer.launch({
  headless: false,
})
const page = await browser.newPage()
await page.setViewport({ width: 1080, height: 1024 })
await loadCookiesIfExist(page)

page.on('console', (msg) => console.log(msg.text()))

await page.goto(`https://x.com/${twitterId}/following`)
if (page.url() === `https://x.com/${twitterId}`) {
  console.error('Please login first.')
  process.exit(1)
}

await page
  .locator(
    '#react-root > div > div > div > main > div > div > div > div > div > section > div > div',
  )
  .wait()
await sleep(1000) // TODO: Don't use this

await page.evaluate(async () => {
  // Like below. (These kind class names are not defined in the real.)
  //
  // <div class="userList">
  //   <div class="info">
  //     <span class="screenName">screenNameA</span>
  //     <span class="twitterId">twitterIdA</span>
  //     <span class="isFollowingMe">isFollowingMe</span>
  //   </div>
  //   <div class="info">
  //     <span class="screenName">screenNameB</span>
  //     <span class="twitterId">twitterIdB</span>
  //     <span class="isFollowingMe">isFollowingMe</span>
  //   </div>
  //   ...
  // </div>

  const userList = document
    .querySelectorAll(
      '#react-root > div > div > div > main > div > div > div > div > div > section > div > div',
    )[0]
    ?.querySelectorAll('div[data-testid="cellInnerDiv"]')
  if (userList === undefined) {
    throw new Error('userList is undefined.')
  }

  for (const user of userList) {
    const info = user.querySelector(
      ':scope > div > div > button > div > div:nth-child(2) > div > div > div',
    )
    if (!info) {
      throw new Error('info is nullish.')
    }

    const screenName = info.querySelector(
      ':scope > div:nth-child(1) > a > div > div:nth-child(1) > span > span:nth-child(1)',
    )?.textContent
    if (!screenName) {
      console.error(
        'error',
        info.querySelector(':scope > div:nth-child(1)')?.outerHTML,
      )
      throw new Error('screenName is nullish.')
    }

    const twitterId = info.querySelector(
      ':scope > div:nth-child(2) > div:nth-child(1) > a > div > div > span',
    )?.textContent
    if (!twitterId) {
      throw new Error('twitterId is nullish.')
    }

    const isFollowingMe =
      info.querySelector(
        ':scope > div:nth-child(2) > div:nth-child(2) > div > span',
      ) !== null

    const twitterInfo: TwitterInfo = {
      screenName,
      twitterId,
      isFollowingMe,
    }
    console.log(JSON.stringify(twitterInfo))
  }
})

await browser.close()
