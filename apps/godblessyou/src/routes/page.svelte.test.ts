import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render } from '@testing-library/svelte/svelte5';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	beforeEach(() => {
		cleanup();
	});

	test('should render h1', async () => {
		const { getByRole } = render(Page);
		const heading = getByRole('heading', { level: 1 });
		expect(heading).toBeInTheDocument();
	});
});
