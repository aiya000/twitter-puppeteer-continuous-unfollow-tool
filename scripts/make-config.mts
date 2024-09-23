import fs from 'fs/promises'

if (process.env.USERNAME === undefined) {
  console.error('Please specify $USERNAME.')
  process.exit(1)
}

const config = `{
  "username": "${process.env.USERNAME}"
}`

await fs.writeFile('./config.json', config, {
  encoding: 'utf-8',
})

console.log('Success.')
