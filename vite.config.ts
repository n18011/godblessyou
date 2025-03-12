import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vitest } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		setupFiles: ['src/test/setup.ts'],
		environmentMatchGlobs: [
			['src/**', 'node']
		]
	}
});
