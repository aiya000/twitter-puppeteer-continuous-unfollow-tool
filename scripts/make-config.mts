import _fs from 'fs'

const fs = _fs.promises

const main = async (): Promise<void> => {
  if (process.env.USERNAME === undefined) {
    console.error('Please specify $USERNAME.')
    return
  }

  const config = `{
    "username": "${process.env.USERNAME}"
  }`

  await fs.writeFile('./config.json', config, {
    encoding: 'utf-8',
  })

  console.log('Success.')
}

await main()
