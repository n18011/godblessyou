<script lang="ts">
  import { onMount } from 'svelte';

  let board = Array(9).fill(null);
  let isXNext = true;
  let winner = null;

  function handleClick(index: number) {
    if (board[index] || winner) return;
    board[index] = isXNext ? 'X' : 'O';
    isXNext = !isXNext;
    winner = calculateWinner(board);
  }

  function calculateWinner(squares: string[]) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function resetGame() {
    board = Array(9).fill(null);
    isXNext = true;
    winner = null;
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-2xl font-bold mb-4">Tic-Tac-Toe</h1>
  <div class="grid grid-cols-3 gap-2">
    {#each board as cell, index}
      <button
        class="w-20 h-20 bg-white border-2 border-gray-300 text-2xl font-bold flex items-center justify-center"
        on:click={() => handleClick(index)}
      >
        {cell}
      </button>
    {/each}
  </div>
  {#if winner}
    <p class="mt-4 text-xl font-semibold">{winner} wins!</p>
  {/if}
  <button
    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    on:click={resetGame}
  >
    Reset Game
  </button>
</div> 