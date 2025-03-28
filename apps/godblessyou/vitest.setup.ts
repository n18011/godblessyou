import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { readable } from 'svelte/store';

// Mock SvelteKit's modules
vi.mock('$app/stores', () => ({
  page: readable({}),
  navigating: readable(null),
  updated: readable(false)
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  beforeNavigate: vi.fn(),
  afterNavigate: vi.fn()
}));

vi.mock('$app/environment', () => ({
  browser: true,
  dev: true,
  building: false
})); 