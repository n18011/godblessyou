import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run preview',
		port: 4173,
		reuseExistingServer: true,
		timeout: 120000
	},
	testDir: 'e2e',
	testMatch: '**/*.test.ts',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'html' : 'list',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		actionTimeout: 30000,
		navigationTimeout: 30000
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
