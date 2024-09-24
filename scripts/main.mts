import parseArgs from 'args-parser'
import { z } from 'zod'
import { requireValueOf } from './zod.mts'
import { login } from './login.mts'
import { saveLeaders } from './saveLeaders.mts'
import { unfollow } from './unfollow.mts'

const argsSchema = z.object({
  // sub commands
  login: z.boolean().optional(),
  'save-leaders': z.boolean().optional(),
  unfollow: z.boolean().optional(),
  // options
  '2fa': z.number().optional(),
})

const args = requireValueOf(argsSchema, parseArgs(process.argv))

if (args.login) {
  await login()
} else if (args['save-leaders']) {
  await saveLeaders()
} else if (args.unfollow) {
  await unfollow()
}
