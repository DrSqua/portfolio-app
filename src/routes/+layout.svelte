<script lang="ts">
	import Footer from '$lib/components/layout/footer.svelte';
	import Header from '$lib/components/layout/header.svelte';


	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Robbe De Helt - Portfolio</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
<Footer></Footer>