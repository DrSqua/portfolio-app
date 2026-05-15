<script lang="ts">
	let { isOverlay = false } = $props();
	let mobileMenuOpen = $state(false);
</script>

<nav class="w-full z-50 {isOverlay ? 'fixed top-0 left-0 bg-transparent' : 'relative bg-surface border-b border-surface-variant'}">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">

			<!-- Mobile menu button -->
			<div class="flex items-center sm:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center p-2 rounded-md text-secondary hover:text-primary hover:bg-surface-variant transition-colors focus:outline-none"
					aria-controls="mobile-menu"
					aria-expanded={mobileMenuOpen}
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
				>
					<span class="sr-only">Open main menu</span>
					<!-- Hamburger Icon -->
					<svg class="block h-6 w-6 {mobileMenuOpen ? 'hidden' : 'block'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
					<!-- Close Icon -->
					<svg class="h-6 w-6 {mobileMenuOpen ? 'block' : 'hidden'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden sm:flex flex-1 desktop-navbar">
				<a href="/" class="nav-item" role="menuitem">Home</a>
				<a href="/about" class="nav-item" role="menuitem">About</a>
				<a href="/blog" class="nav-item" role="menuitem">Blog</a>
				<a href="/projects" class="nav-item" role="menuitem">Projects</a>
			</div>

		</div>
	</div>

	<!-- Mobile menu dropdown -->
	{#if mobileMenuOpen}
		<div class="sm:hidden mobile-nav {isOverlay ? 'bg-surface/95 backdrop-blur-md shadow-lg' : 'bg-surface-bright'}" role="menu">
			<div class="space-y-1 px-4 pb-4 pt-2">
				<a href="/" class="mobile-nav-item" role="menuitem">Home</a>
				<a href="/about" class="mobile-nav-item" role="menuitem">About</a>
				<a href="/blog" class="mobile-nav-item" role="menuitem">Blog</a>
				<a href="/projects" class="mobile-nav-item" role="menuitem">Projects</a>
			</div>
		</div>
	{/if}
</nav>

<style lang="scss">
  @reference "../../../routes/layout.css";

  nav {
    .desktop-navbar {
      @apply flex-row items-center justify-center gap-8;

      .nav-item {
        @apply text-white text-xl tracking-wide transition-all duration-100;

        &:hover {
          @apply text-primary;
          text-shadow: 0 0 12px rgba(93, 202, 165, 0.6);
        }
      }
    }

    .mobile-nav {
      .mobile-nav-item {
        @apply block px-3 py-3 rounded-md text-base font-medium text-secondary/80 hover:text-primary hover:bg-surface-variant transition-colors;
      }
    }
  }
</style>