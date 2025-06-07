import 'dotenv/config'

import { client, postPeopleSearch } from '../src'

async function main(): Promise<void> {
  client.setConfig({
    auth: () => `${process.env.HIBOB__USERNAME}:${process.env.HIBOB__PASSWORD}`,
  })

  console.log('Search people in HiBob...')
  const response = await postPeopleSearch({
    body: { fields: ['/root/id'] },
  })
  console.log('Operation was performed with %o', response.data)
}

main()
