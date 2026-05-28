<script lang="ts">
	import Header from '$lib/components/layout/header.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData, children: any } = $props();

	// It's generally best to default to false (mobile-first) for the initial server render,
	let innerWidth = $state(0);
	// However, when we then detect we're on a wide screen we can open the sidenav
	let sidebar = $derived(innerWidth >= 1024);
</script>

<svelte:window bind:innerWidth />

<header>
	<Header />
</header>

<div class="p-0 lg:p-2 h-full">
	<div class="flex flex-col md:flex-row h-full">
		<aside class={`shrink-0 transition-all duration-300
        ${sidebar ? 'w-full md:w-1/5 lg:w-1/6' : 'w-full md:w-10'}`}>

			<!-- Mobile toggle (visible only on mobile) -->
			<div class="flex items-center px-4 py-2 md:hidden">
				<button onclick={() => sidebar = !sidebar} aria-label="toggle-menu mr-auto">
					{#if sidebar}
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{:else}
						<p class="flex flex-row gap-4">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg> <span class="text-sm text-gray-500">view more blogs</span>
						</p>
					{/if}
				</button>
			</div>

			<!-- Desktop open button (only when closed) -->
			{#if !sidebar}
				<button onclick={() => sidebar = !sidebar} aria-label="toggle-menu"
								class="hidden md:flex items-center justify-center w-10 h-10 mt-4">
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
			{/if}

			<!-- Nav: vertical collapse on mobile, horizontal on desktop -->
			<nav class={`vertical-nav vertical-nav-transparent overflow-hidden transition-all duration-300
          ${sidebar
            ? 'max-h-[1000px] opacity-100 px-4 py-6 md:max-h-none'
            : 'max-h-0 opacity-0 md:max-h-none md:opacity-0 md:w-0 md:px-0'
          }`}>

				{#each Object.entries(data.groupedPosts) as [category, posts]}
					<div class="mb-6">
						<a class="font-semibold tracking-wide" href="/blog">{category}</a>
						<hr class="h-px bg-blue-900 border-0 dark:bg-blue-950 my-2">

						<ul class="flex flex-col gap-2.5 mt-2">
							{#each posts as post}
								<li>
									<a href={`/blog/${post.slug}`} class="text-sm text-gray-400 hover:text-[#64d2b4] transition-colors leading-tight block">
										{post.title}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}

				<!-- Desktop close button (inside nav, only on desktop) -->
				<button class="button hidden md:flex mt-4" onclick={() => sidebar = !sidebar}>
					<span>close</span>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</nav>
		</aside>

		<main class="flex-1 min-w-0 mt-8 md:mt-12 lg:mt-16 mx-2 md:mx-4">
			{@render children()}
		</main>
	</div>
</div>