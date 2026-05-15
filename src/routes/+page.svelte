<script>
	import DistributedSystemsBackground from '$lib/components/layout/DistributedSystemsBackground.svelte';
	import Header from '$lib/components/layout/header.svelte';
</script>

<!-- The background is now isolated and fixed to the viewport -->
<div class="fixed-background">
	<DistributedSystemsBackground />
</div>

<!-- All your page content goes here and scrolls naturally over the background -->
<div class="scrollable-content">
	<Header isOverlay={true} />

	<main class="hero">
		<div class="content">
			<h1 class="giant-greeting">Hi there</h1>
		</div>
	</main>

	<!-- Future content sections can go here -->
</div>

<style>
    .fixed-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background: #080d14;
        z-index: -1;
    }

    /* Ensure content container allows natural scrolling */
    .scrollable-content {
        position: relative;
        z-index: 1;
    }

    .hero {
        width: 100%;
        min-height: 100vh; /* min-height is safer than fixed height for accessibility */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .giant-greeting {
        font-size: 12rem;
        font-weight: 900;
        margin: 0;
        color: #ffffff;
        line-height: 1;

        /* Subtle text shadow so it pops off the complex background :) */
        text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    /* Responsive adjustment for mobile screens */
    @media (max-width: 768px) {
        .giant-greeting {
            font-size: 8rem;
        }
    }
</style>