import { defineConfig } from 'cypress'
import { join } from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    video: false,
    setupNodeEvents(on, config) {
      return config
    },
    specPattern: join(__dirname, './cypress/e2e/**/*.{js,jsx,ts,tsx}'),
    supportFile: join(__dirname, './cypress/support/e2e.ts'),
  },
  env: {
    API_KEY: 'ak_go'
  }
})
