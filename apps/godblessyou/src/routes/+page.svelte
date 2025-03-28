<script lang="ts">
	import Counter from './Counter.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1 class="text-4xl font-bold mb-8">Welcome to GodBlessYou</h1>
	<h2 class="text-xl mb-4">
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
	<Counter />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
