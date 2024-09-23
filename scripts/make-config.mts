import fs from 'fs/promises'

const username = process.env.npm_config_username
if (username === undefined) {
  console.error('Please specify $USERNAME.')
  process.exit(1)
}

const config = `{
  "username": "${username}"
}`

await fs.writeFile('./config.json', config, {
  encoding: 'utf-8',
})

console.log(`Success. Hello ${username}.`)
