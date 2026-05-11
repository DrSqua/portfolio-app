<script>
	import DistributedSystemsBackground from '$lib/components/layout/DistributedSystemsBackground.svelte';
	import Header from '$lib/components/layout/header.svelte';
</script>


<Header isOverlay='true' ></Header>
<div class="hero">
	<DistributedSystemsBackground />
	<div class="content">
		<!-- your hero content here -->
	</div>
</div>

<style>
    .hero {
        position: relative;
        width: 100%;
        height: 100vh;
        background: #080d14;
        overflow: hidden;
    }
    .content {
        position: relative;
        z-index: 1;
    }
</style>