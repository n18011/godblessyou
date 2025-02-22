<script context="module">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Page from './Page.svelte';

	const { Story } = defineMeta({
		title: 'Page',
		component: Page,
	});
</script>

<script>
	let args = {};
</script>

<Story name="Default" {args}>
	<Page {...args} />
</Story>
