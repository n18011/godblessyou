import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TicTacToe from './TicTacToe.svelte';

// Mock onMount to prevent lifecycle errors during testing
vi.mock('svelte', () => ({
  ...vi.importActual('svelte'),
  onMount: vi.fn()
}));

describe('TicTacToe Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the Tic-Tac-Toe board', () => {
    const { getAllByRole } = render(TicTacToe);
    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(10); // 9 cells + 1 reset button
  });

  it('should allow players to take turns', async () => {
    const { getAllByRole } = render(TicTacToe);
    const buttons = getAllByRole('button');

    await fireEvent.click(buttons[0]);
    expect(buttons[0].textContent).toBe('X');

    await fireEvent.click(buttons[1]);
    expect(buttons[1].textContent).toBe('O');
  });

  it('should declare a winner', async () => {
    const { getAllByRole, getByText } = render(TicTacToe);
    const buttons = getAllByRole('button');

    // X wins
    await fireEvent.click(buttons[0]); // X
    await fireEvent.click(buttons[3]); // O
    await fireEvent.click(buttons[1]); // X
    await fireEvent.click(buttons[4]); // O
    await fireEvent.click(buttons[2]); // X

    expect(getByText('X wins!')).toBeInTheDocument();
  });

  it('should reset the game', async () => {
    const { getAllByRole, getByText } = render(TicTacToe);
    const buttons = getAllByRole('button');

    await fireEvent.click(buttons[0]); // X
    await fireEvent.click(buttons[3]); // O
    await fireEvent.click(buttons[1]); // X
    await fireEvent.click(buttons[4]); // O
    await fireEvent.click(buttons[2]); // X

    expect(getByText('X wins!')).toBeInTheDocument();

    await fireEvent.click(buttons[9]); // Reset button

    buttons.slice(0, 9).forEach((button) => {
      expect(button.textContent).toBe('');
    });
  });
}); 