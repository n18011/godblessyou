<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { registerServiceWorker } from '$lib/pwa';
	import { browser } from '$app/environment';

	onMount(async () => {
		if (browser) {
			await registerServiceWorker();
		}
	});
</script>

<!-- {@render children()} -->
<slot />
