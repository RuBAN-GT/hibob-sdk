import { join } from 'path'

import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: join(__dirname, 'utils', 'hibob-public-api.generated.yml'),
  output: 'src/generated',
  plugins: ['@hey-api/client-axios'],
})
