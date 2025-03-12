<script lang="ts">
  import { onMount } from 'svelte';

  interface Todo {
    id: number;
    text: string;
    completed: boolean;
    editing: boolean;
  }

  let todos: Todo[] = [];
  let newTodo = '';
  let filter: 'all' | 'active' | 'completed' = 'all';
  let nextId = 1;

  // ローカルストレージからデータを読み込む
  onMount(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedNextId = localStorage.getItem('nextId');
    
    if (savedTodos) {
      todos = JSON.parse(savedTodos);
    }
    
    if (savedNextId) {
      nextId = parseInt(savedNextId, 10);
    }
  });

  // データをローカルストレージに保存する
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('nextId', nextId.toString());
  }

  function addTodo() {
    if (newTodo.trim()) {
      todos = [...todos, {
        id: nextId++,
        text: newTodo.trim(),
        completed: false,
        editing: false
      }];
      newTodo = '';
      saveTodos();
    }
  }

  function removeTodo(id: number) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
  }

  function toggleTodo(id: number) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
  }

  function startEditing(id: number) {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, editing: true } : { ...todo, editing: false }
    );
  }

  function finishEditing(todo: Todo, event: Event) {
    const input = event.target as HTMLInputElement;
    const text = input.value.trim();
    if (text) {
      todos = todos.map(t =>
        t.id === todo.id ? { ...t, text, editing: false } : t
      );
      saveTodos();
    } else {
      removeTodo(todo.id);
    }
  }

  $: filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
</script>

<main class="container mx-auto px-4 py-8 max-w-2xl">
  <h1 class="text-4xl font-bold mb-8 text-center">Todo App</h1>

  <div class="mb-6">
    <form on:submit|preventDefault={addTodo} class="flex gap-2">
      <input
        type="text"
        bind:value={newTodo}
        placeholder="新しいタスクを入力..."
        class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        追加
      </button>
    </form>
  </div>

  <div class="mb-4 flex justify-center gap-2">
    <button
      class="px-4 py-2 rounded-lg {filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      on:click={() => filter = 'all'}
    >
      すべて
    </button>
    <button
      class="px-4 py-2 rounded-lg {filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      on:click={() => filter = 'active'}
    >
      未完了
    </button>
    <button
      class="px-4 py-2 rounded-lg {filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}"
      on:click={() => filter = 'completed'}
    >
      完了済み
    </button>
  </div>

  <ul class="space-y-2">
    {#each filteredTodos as todo (todo.id)}
      <li class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
        <div class="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            on:change={() => toggleTodo(todo.id)}
            class="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          {#if todo.editing}
            <input
              type="text"
              value={todo.text}
              on:blur={(e) => finishEditing(todo, e)}
              on:keydown={(e) => e.key === 'Enter' && finishEditing(todo, e)}
              class="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autofocus
            />
          {:else}
            <span
              class="flex-1 {todo.completed ? 'line-through text-gray-500' : ''}"
              on:dblclick={() => startEditing(todo.id)}
            >
              {todo.text}
            </span>
          {/if}
        </div>
        <button
          on:click={() => removeTodo(todo.id)}
          class="px-3 py-1 text-red-500 hover:bg-red-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          削除
        </button>
      </li>
    {/each}
  </ul>

  {#if todos.length > 0}
    <div class="mt-4 text-sm text-gray-600 text-right">
      残りのタスク: {todos.filter(todo => !todo.completed).length}個
    </div>
  {/if}
</main>

<style>
  :global(body) {
    background-color: #f3f4f6;
  }
</style>
