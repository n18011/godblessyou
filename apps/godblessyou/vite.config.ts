import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname =
	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const plugins = [
	tailwindcss(),
	sveltekit(),
	paraglideVitePlugin({
		project: './project.inlang',
		outdir: './src/lib/paraglide'
	})
];

// テスト環境の場合のみsvleteTestingプラグインを追加
if (process.env.NODE_ENV === 'test') {
	const { svelteTesting } = await import('@testing-library/svelte/vite');
	plugins.push(svelteTesting());
}

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
	plugins,
	test: {
		workspace: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
