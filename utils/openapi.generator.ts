import axios from 'axios'
import { mapSeries } from 'bluebird'
import { writeFile } from 'fs/promises'
import yaml from 'js-yaml'
import merge from 'lodash.merge'
import type { OpenAPIV3 } from 'openapi-types'
import { resolve } from 'path'
import * as rax from 'retry-axios'

const llmsUrl = 'https://apidocs.hibob.com/llms.txt'
const hibobApiFileName = './utils/hibob-public-api.generated.yml'
const httpClient = axios.create({
  headers: { 'User-Agent': 'Hibob SDK OpenAPI Generator' },
})
httpClient.defaults.raxConfig = { instance: httpClient }
rax.attach(httpClient)

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchLlmsData(): Promise<string[]> {
  const { data } = await httpClient.get<string>(llmsUrl)
  return Array.from(data.matchAll(/\((https:\/\/[^)]+?\.md)\)/g), (m) => m[1]).filter((url) =>
    url.includes('/reference/'),
  )
}

function parseBlock(content: string): any {
  try {
    return yaml.load(content)
  } catch {
    return JSON.parse(content)
  }
}

async function extractSpec(specUrl: string): Promise<OpenAPIV3.Document | null> {
  await sleep(500)

  let content
  try {
    console.log('Fetching spec from %s', specUrl)
    const { data } = await httpClient.get<string>(specUrl)
    content = data.match(/```(?:yaml|yml|json)[^\n]*\n([\s\S]*?)```/i)
  } catch {
    console.error('Failed to fetch spec from %s', specUrl)
    return null
  }

  if (!content) {
    console.error('No OpenAPI spec block found in %s', specUrl)
    return null
  }

  console.log('Extracting OpenAPI spec from %s', specUrl)
  return parseBlock(content[1]) as OpenAPIV3.Document
}

function compileSpecs(specs: OpenAPIV3.Document[]): string {
  const base = specs.shift()!
  for (const s of specs) {
    merge(base.paths, s.paths)
    merge(base.components, s.components)
    merge(base.tags, s.tags)
  }

  return yaml.dump(base, { lineWidth: 120 })
}

async function main(): Promise<void> {
  console.log('Fetching LLMs data from %s', llmsUrl)
  const llmsData = await fetchLlmsData()
  console.log('Fetched %o LLMs', llmsData)
  if (llmsData.length === 0) {
    console.error('No LLMs data found.')
    return
  }

  console.log('Extracting OpenAPI specs from LLMs data...')
  const specs = (await mapSeries(llmsData, extractSpec)).filter(Boolean) as OpenAPIV3.Document[]
  if (specs.length === 0) {
    console.error('No OpenAPI specs found in the LLMs data.')
    return
  }

  console.log('Extracted %d OpenAPI specs', specs.length)
  const compiledSpec = compileSpecs(specs)
  console.log('OpenAPI spec was compiled.')

  console.log('Writing OpenAPI spec to %s', hibobApiFileName)
  await writeFile(resolve(hibobApiFileName), compiledSpec, 'utf8')
  console.log('OpenAPI spec written successfully.')
}

main()
