import { Page } from 'puppeteer'
import { z } from 'zod'
import fs from 'node:fs/promises'
import { requireValueOf } from './zod.mts'

const cookieSameSiteSchema = z.enum(['Strict', 'Lax', 'None'])
const cookiePrioritySchema = z.enum(['Low', 'Medium', 'High'])
const cookieSourceSchemeSchema = z.enum(['Unset', 'NonSecure', 'Secure'])

const cookieParamSchema = z.object({
  name: z.string(),
  value: z.string(),
  url: z.string().optional(),
  domain: z.string().optional(),
  path: z.string().optional(),
  secure: z.boolean().optional(),
  httpOnly: z.boolean().optional(),
  sameSite: cookieSameSiteSchema.optional(),
  expires: z.number().optional(),
  priority: cookiePrioritySchema.optional(),
  sameParty: z.boolean().optional(),
  sourceScheme: cookieSourceSchemeSchema.optional(),
  partitionKey: z.string().optional(),
})

const cookiesJson = './cookies.json'

export const tryToAsync = async <T,>(
  f: () => Promise<T>,
): Promise<T | Error> => {
  try {
    return await f()
  } catch (e) {
    return new Error(`${e}`)
  }
}

/**
 * Returns an Error if cookies.json is not accesible.
 */
export const loadCookiesIfExist = async (page: Page): Promise<null | Error> => {
  const canAccessToConfig = await tryToAsync(async () => {
    await fs.access(cookiesJson, fs.constants.R_OK)
    return true
  })
  if (canAccessToConfig instanceof Error) {
    return canAccessToConfig
  }

  const json = await fs.readFile(cookiesJson, {
    encoding: 'utf-8',
  })
  const cookies = requireValueOf(cookieParamSchema.array(), JSON.parse(json))
  await page.setCookie(...cookies)
  return null
}

export const saveCookies = async (page: Page): Promise<void> => {
  const cookies = await page.cookies()
  await fs.writeFile(cookiesJson, JSON.stringify(cookies, null, 2), {
    encoding: 'utf-8',
  })
}
