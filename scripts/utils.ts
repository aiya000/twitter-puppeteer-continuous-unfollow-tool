import { Page } from 'puppeteer'
import { z } from 'zod'
import _fs from 'fs'
import { requireValueOf } from './zod'

const fs = _fs.promises

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

export const loadCookiesIfExist = async (page: Page): Promise<void> => {
  const json = await fs.readFile('./cookies.json', {
    encoding: 'utf-8',
  })
  const cookies = requireValueOf(cookieParamSchema.array(), JSON.parse(json))
  await page.setCookie(...cookies)
}

export const saveCookies = async (page: Page): Promise<void> => {
  const cookies = await page.cookies()
  await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2), {
    encoding: 'utf-8',
  })
}
