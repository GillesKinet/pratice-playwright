
import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';
require('dotenv').config()

export default defineConfig<TestOptions>({
  testDir: './tests',
  retries: 1,
  reporter: [['json', {outputFile: 'test-results/jsonReport.json'}], ['html']],

  use: {
    globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV==='1' ? 'http://localhost:4200/'
           : process.env.STAGING == '1' ? 'http://localhost:4202/'
           : 'http://localhost:4200/',
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'],
      baseURL: 'http://localhost:4200/' }
    },
    {
      name: 'acc',
      use: { ...devices['Desktop Chrome'],
      baseURL: 'http://localhost:4200/' }
    },
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: {browserName: 'firefox'}
    },
    {
      name: 'pageObjectFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: {
        viewport: {width: 1920, height: 1080}
      }
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {...devices['iPhone 13 Pro']}
    }
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/'
  }
});
