import { describe, it, expect, beforeEach } from 'vitest';
import { cleanup, render } from '@testing-library/svelte/svelte5';
import Button from './Button.svelte';

describe('Button', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders with default props', async () => {
    const { getByRole } = render(Button, { props: { label: 'Click me' } });
    const button = getByRole('button');
    expect(button).toHaveTextContent('Click me');
  });

  it('applies primary variant styles', async () => {
    const { getByRole } = render(Button, { props: { label: 'Primary', variant: 'primary' } });
    const button = getByRole('button');
    expect(button.className).toContain('bg-primary-600');
  });

  it('applies secondary variant styles', async () => {
    const { getByRole } = render(Button, { props: { label: 'Secondary', variant: 'secondary' } });
    const button = getByRole('button');
    expect(button.className).toContain('bg-secondary-600');
  });

  it('is disabled when disabled prop is true', async () => {
    const { getByRole } = render(Button, { props: { label: 'Disabled', disabled: true } });
    const button = getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
}); 