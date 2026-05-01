import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';

dotenv.config();
export default defineConfig({
  reporter: [
    ['list'],
    [
      'playwright-qase-reporter',
      {
        mode: 'testops',
        testops: {
          api: {
            token: process.env.QASE_API_TOKEN,
          },
          project: 'EBCDC',
        },
      },
    ],
  ],
});