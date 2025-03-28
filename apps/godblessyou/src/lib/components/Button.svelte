<!-- Button.svelte -->
<script lang="ts">
  export let label: string;
  export let variant: 'primary' | 'secondary' = 'primary';
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
</script>

<button
  {type}
  {disabled}
  class="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none {variant === 'primary' ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500' : 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500'}"
  on:click
>
  {label}
</button> 