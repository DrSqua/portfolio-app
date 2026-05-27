<script lang="ts">
	import DistributedSystemsBackground from '$lib/components/layout/DistributedSystemsBackground.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import ProjectsSection from '$lib/components/layout/homepage/ProjectsSection.svelte';

	const previewSectionOptions: string[] = ["blog", "projects", "academia", "about"]
	let selectedPreview: string = $state("blog")

	const recentBlogs = [
		{
			'name': "'What's the delay?' - Slow database queries, a rite of passage.",
			"link": '/blog',
			"date": "27/05/2026",
			"readTime": 8,
			"tags": ["Distributed Systems", "Database"],
		}
	]

	const topics = ["Website Design", "Observability", "Homelab", "Learning a language"]
	const selectedTopics: string[] = []

	const highlightedProjects = [
			{
				name: 'IngeniumUA Website',
				tags: ['Website', 'Distributed System', 'System Design'],
				description: "A student organisation's website.",
				link: '/projects/ingenium-ua-website',
				year: '2023-2026',
				stack: ['SvelteKit', 'FastAPI', 'PostgreSQL', 'Stripe', 'Azure'],
			},
			{
				name: 'Boids in QuadTree',
				tags: ['Rust', 'Simulation'],
				description: "Serving primarily as a learning project, i've implemented a boid simulation poweder by a quadtree implementation in rust.",
				link: '/projects/rust-quadtree',
				year: '2023',
				stack: ['Rust'],
			},
			{
				name: 'This website',
				tags: ['Website', 'Hosting'],
				description: "A bit cliché, but this portfolion website is also one of the projects I've invested quite some time in.",
				link: '/projects/portfolio-app',
				year: '2024',
				stack: ['SvelteKit', 'Cloudflare'],
			},
	]

	const researchInterests = ["Distributed Systems", "Machine Learning", "Causality"]
	const publications = [
		{
			title: "Enhancing 5G Core Resilience with Distributed Tracing Techniques",
			type: 'Master Thesis',
			authors: "Robbe De Helt, Raul Cuervo, Nina Slamnik-Krijestorac, Johann Marquez-Barja",
			year: "2025-2026",
			url: "#"
		},
		{
			title: "Multivariate online controlled experiments using\n" +
				"Bayesian Inference in Recommender systems",
			type: 'Bachelor Thesis',
			authors: "Robbe De Helt, Joeri Rammelaere, Bart Goethals",
			year: "2024-2025",
			url: "#"
		}
	]
</script>

<div class="fixed inset-0 w-full h-screen bg-[#080d14] -z-10">
	<DistributedSystemsBackground />
</div>

<div class="relative z-10">
	<Header isOverlay={true} />

	<main class="w-full min-h-screen flex items-center justify-center">
		<div>
			<h1 class="text-[8rem] md:text-[12rem] font-black mx-4 text-white leading-none [text-shadow:0_10px_30px_rgba(0,0,0,0.5)]">
				Hi, there
			</h1>
		</div>
	</main>

	<nav class="flex justify-center">
		<div class="flex gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
			{#each previewSectionOptions as previewSection}
				<button
					onclick={() => {selectedPreview = previewSection}}
					class="nav-pill"
					class:active-pill={selectedPreview === previewSection}
				>{previewSection}</button>
			{/each}
		</div>
	</nav>

	<section class="px-6 md:pl-16 md:pr-12">
		{#if (selectedPreview === "projects")}
			<p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">Highlighted projects:</p>
			<div class="flex flex-col md:flex-row gap-10 md:gap-16 w-full mx-auto">
				<aside class="w-full md:w-48 flex-shrink-0">
					<p class="text-[10px] font-mono tracking-[0.18em] uppercase mb-4 text-[#999] px-3">
						Topics
					</p>
					<ul class="flex flex-col gap-1 list-none p-0 m-0">
						{#each topics as topic}
							<li>
								<button
									onclick={() => selectedTopics.push(topic)}
									class="w-full text-left px-3 py-2 rounded-lg text-[13px] font-mono tracking-wide transition-colors duration-200 border-none cursor-pointer {selectedTopics.includes(topic) ? 'bg-black/[0.06] text-[#1a1a1a] font-semibold' : 'bg-transparent text-[#888] hover:bg-black/[0.03] hover:text-[#1a1a1a]'}"
								>
									{topic}
								</button>
							</li>
						{/each}
					</ul>
				</aside>

				<div class="flex-grow grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 md:gap-6">
					{#each highlightedProjects.slice(0, 3) as project}
						<div class="bg-white border border-black/[0.06] rounded-2xl px-6 py-6 md:px-8 md:pt-8 md:pb-7 flex flex-col h-full transition-colors duration-200 hover:border-black/15 shadow-sm">

							<div class="flex justify-between items-center mb-5">
								<p class="text-[10px] font-mono tracking-[0.12em] text-[#5a9e8a]">
									{project.tags.join(" • ")}
								</p>
								<p class="text-[11px] font-mono text-[#bbb]">
									{project.year}
								</p>
							</div>

							<h3 class="text-2xl font-extrabold text-[#1a1a1a] tracking-tight mb-4 leading-none">{project.name}</h3>
							<p class="text-sm text-[#666] leading-relaxed mb-7 flex-grow">{project.description}</p>

							<div class="flex items-center justify-between gap-4 mt-auto">
								<div class="flex flex-wrap gap-1.5">
									{#each project.stack as tech}
								<span class="text-[10px] font-mono tracking-wider text-[#666] bg-black/[0.03] border border-black/[0.06] rounded-full px-2.5 py-1">
									{tech}
								</span>
									{/each}
								</div>
								<a href={project.link} class="text-xs font-mono tracking-wider text-[#888] hover:text-[#1a1a1a] whitespace-nowrap transition-colors duration-200 no-underline" target="_blank" rel="noopener">
									view project ↗
								</a>
							</div>
						</div>
					{/each}
					<a href="/projects" class="bg-white/[0.5] border border-black/[0.06] rounded-2xl px-6 py-6 md:px-8 flex flex-col items-center justify-center h-full transition-colors duration-200 hover:bg-white/[0.8] hover:border-black/15 group no-underline shadow-sm min-h-[250px]">
						<div class="w-12 h-12 rounded-full bg-white border border-black/[0.06] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-sm">
							<span class="text-[#888] group-hover:text-[#1a1a1a] transition-colors text-lg">→</span>
						</div>
						<p class="text-[12px] font-mono tracking-[0.1em] text-[#1a1a1a] uppercase">
							view all projects
						</p>
					</a>
				</div>
			</div>
		{:else if (selectedPreview === "blog")}
			<p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">Recent writing:</p>
			<div class="flex flex-col md:flex-row gap-4">
				{#each recentBlogs as blog (blog.name)}
					<article class="max-w-sm bg-white/5 border border-white/10 rounded-2xl px-6 py-6 md:px-8 md:pt-8 md:pb-7">
						<div class="flex justify-between items-center mb-5">
							<p class="text-[10px] font-mono tracking-[0.12em] text-[#64d2b4]/70">
								{blog.tags.join(" • ")}
							</p>
						</div>
						<a href={blog.link} class="text-2xl font-extrabold text-white tracking-tight leading-none">
							{blog.name}
						</a>
						<div class="flex items-center justify-between gap-4 mt-4">
							<p class="text-sm text-white/50 leading-relaxed">
								{blog.date}
							</p>
							<p class="text-sm text-white/50 leading-relaxed">
								{blog.readTime} min read
							</p>
						</div>
					</article>
				{/each}
				<a href="/blog" class="bg-gray-200/10 border border-white/10 rounded-2xl px-6 py-6 md:px-8 md:pt-8 md:pb-7 flex flex-col justify-center items-center hover:bg-gray-200/[0.2]">
					<p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">view more</p>
				</a>
			</div>
		{:else if (selectedPreview === "about")}
			<p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">About me:</p>
		{:else if selectedPreview === "academia"}
			<p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">Academic career:</p>
			<div class="grid gap-8 md:gap-10 grid-cols-1 sm:grid-cols-[1fr_2fr]">
				<div>
					<p class="font-mono text-white max-w-sm">I'm currently working as a master's student in the Programmable Intelligent Networks group as a part of IDLab.</p>
				</div>
				<div>
					<p class="text-[10px] font-mono tracking-[0.18em] uppercase mb-4 text-[#999]">publications / research projects</p>
					<div class="flex flex-col gap-2.5">
						{#each publications as pub}
							<a href={pub.url} class="block bg-white rounded-xl px-4 py-3.5 no-underline border border-black/[0.06] transition-colors duration-200 hover:border-black/20">
								<p class="text-[13px] font-semibold leading-snug mb-1 text-[#1a1a1a]">{pub.title}</p>
								<p class="text-[10px] font-mono tracking-wide mb-0.5 text-[#5a9e8a]">{pub.type}</p>
								<p class="text-[10px] font-mono tracking-wide text-[#bbb]">{pub.authors} · {pub.year}</p>
							</a>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			Else
		{/if}
	</section>



	<ProjectsSection></ProjectsSection>

	<section class="max-w-5xl mx-auto mb-16 px-8">
		<div class="border border-white/10 rounded-[10px] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white/[0.02]">
			<p class="text-lg text-white/60 italic leading-relaxed">
				<em class="text-white/90 not-italic">I spend most of my time building projects and writing software for things I think are 'cool'</em> (a low barrier).
				I’m into a wide range of tech topics, simply enjoying making things and figuring them out as I go.
			</p>
			<a href="/about" class="px-[22px] py-2.5 rounded-full border border-white/20 text-xs font-mono tracking-[0.08em] text-white/60 no-underline whitespace-nowrap transition-colors duration-200 hover:border-white/40 hover:text-white">
				more about me :)
			</a>
		</div>
	</section>
</div>

<style lang="scss">
  @reference "../routes/layout.css";

  .nav-pill {
    @apply px-[10px] md:px-[22px] py-2 rounded-full text-[13px] font-mono tracking-[0.08em] text-white/50 no-underline transition-colors duration-200 hover:bg-white/[0.08] hover:text-white cursor-pointer;
  }
  .active-pill {
    @apply bg-white/[0.08] text-white;
  }
</style>