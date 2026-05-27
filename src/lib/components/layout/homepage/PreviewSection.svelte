<script lang="ts">
	let selectedPreview: string = $state("blog")

	const recentBlogs = [
		{
			name: "What's the delay",
			date: "27 May 2026",
			readTime: 8,
			tags: ["Distributed Systems", "Database"],
			slug: "/blog/whats-the-delay"
		}
	]

	const highlightedProjects = [
		{
			name: "Meshlink",
			description: "Offline-first sync with CRDTs — no central server needed.",
			language: "TypeScript",
			status: "active",
			url: "https://github.com/you/meshlink"
		},
		{
			name: "Krate",
			description: "Embeddable key/value store in Rust. Single binary, 4 MB.",
			language: "Rust",
			status: "active",
			url: "https://github.com/you/krate"
		},
		{
			name: "Trace",
			description: "Visual observability for distributed services. Spans + logs.",
			language: "SvelteKit",
			status: "archived",
			url: "https://github.com/you/trace"
		}
	]

	const researchInterests = [
		"Distributed Systems",
		"Consensus Protocols",
		"Database Internals",
		"Formal Methods"
	]

	const publications = [
		{
			title: "Adaptive quorum strategies in geo-distributed Raft clusters",
			venue: "VLDB 2025",
			authors: "Your Name, Co-author",
			year: "2025",
			url: "#"
		},
		{
			title: "Measuring tail latency under partial partition in replicated state machines",
			venue: "EuroSys 2024",
			authors: "Your Name",
			year: "2024",
			url: "#"
		}
	]
</script>

<section class="preview-section">
	<div class="preview-panel">

		<!-- Tab nav -->
		<nav class="preview-nav">
			<div class="preview-pills">
				{#each ["blog", "projects", "academia", "about me"] as tab}
					<button
						onclick={() => { selectedPreview = tab }}
						class="preview-pill"
						class:active={selectedPreview === tab}
					>{tab}</button>
				{/each}
			</div>
		</nav>

		<!-- Blog -->
		{#if selectedPreview === "blog"}
			<p class="section-label">recent writing</p>
			<div class="blog-grid">
				{#each recentBlogs as blog}
					<a href={blog.slug} class="blog-card">
						<p class="card-tag">{blog.tags.join(" · ")}</p>
						<h3 class="blog-title">{blog.name}</h3>
						<div class="blog-meta">
							<span>{blog.date}</span>
							<span>{blog.readTime} min read</span>
						</div>
					</a>
				{/each}
				<a href="/blog" class="more-card">view all posts →</a>
			</div>

			<!-- Projects -->
		{:else if selectedPreview === "projects"}
			<p class="section-label">highlighted projects</p>
			<div class="project-grid">
				{#each highlightedProjects as project}
					<a href={project.url} target="_blank" rel="noopener" class="project-card">
						<div class="project-card-top">
							<p class="project-name">{project.name}</p>
							{#if project.status === "active"}
								<span class="status-dot active" title="Active"></span>
							{/if}
						</div>
						<p class="project-desc">{project.description}</p>
						<p class="project-lang">{project.language}</p>
					</a>
				{/each}
				<a href="/projects" class="more-card">view all projects →</a>
			</div>

			<!-- Academia -->
		{:else if selectedPreview === "academia"}
			<div class="academia-layout">
				<div class="interests-col">
					<p class="section-label">research interests</p>
					<div class="interests-list">
						{#each researchInterests as interest}
							<span class="interest-tag">{interest}</span>
						{/each}
					</div>
				</div>
				<div class="pubs-col">
					<p class="section-label">publications</p>
					<div class="pubs-list">
						{#each publications as pub}
							<a href={pub.url} class="pub-card">
								<p class="pub-title">{pub.title}</p>
								<p class="pub-venue">{pub.venue}</p>
								<p class="pub-authors">{pub.authors} · {pub.year}</p>
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- About -->
		{:else if selectedPreview === "about me"}
			<p class="section-label">about me</p>
			<div class="about-preview">
				<p class="about-body">
					I'm a software engineer who builds things for fun and occasionally for
					profit. I like distributed systems, compilers, and figuring out why
					something is slower than it should be.
				</p>
				<a href="/about" class="about-cta">read more →</a>
			</div>
		{/if}

	</div>
</section>

<style lang="scss">
  @reference "../../../../routes/layout.css";

  .preview-section {
    @apply px-6 md:px-16 mb-24;
  }

  .preview-panel {
    background: #e8ecf0;
    border-radius: 24px;
    @apply px-8 pt-8 pb-10 md:px-10 md:pt-10;
  }

  /* Nav */
  .preview-nav {
    @apply mb-8;
  }

  .preview-pills {
    @apply flex gap-1;
  }

  .preview-pill {
    @apply px-4 py-2 rounded-full text-[12px] font-mono tracking-wide
    text-black/40 bg-transparent border-none cursor-pointer
    transition-colors duration-200;

    &:hover { @apply text-black/70; }
    &.active { @apply bg-black/10 text-black/80; }
  }

  /* Shared */
  .section-label {
    @apply text-[10px] font-mono tracking-[0.18em] uppercase mb-4;
    color: #999;
  }

  /* Blog */
  .blog-grid {
    @apply grid gap-2.5;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .blog-card {
    @apply block bg-white rounded-2xl px-5 py-5 no-underline
    border border-black/[0.06] transition-colors duration-200;

    &:hover { @apply border-black/20; }
  }

  .card-tag {
    @apply text-[9px] font-mono tracking-[0.12em] uppercase mb-2.5;
    color: #5a9e8a;
  }

  .blog-title {
    @apply text-[13px] font-semibold leading-snug mb-2.5;
    color: #1a1a1a;
  }

  .blog-meta {
    @apply flex justify-between text-[11px] font-mono;
    color: #bbb;
  }

  /* Projects */
  .project-grid {
    @apply grid gap-2.5;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .project-card {
    @apply block bg-white rounded-2xl px-5 py-5 no-underline
    border border-black/[0.06] transition-colors duration-200;

    &:hover { @apply border-black/20; }
  }

  .project-card-top {
    @apply flex items-center justify-between mb-1;
  }

  .project-name {
    @apply text-[15px] font-bold tracking-tight;
    color: #1a1a1a;
  }

  .status-dot {
    @apply w-2 h-2 rounded-full flex-shrink-0;
    &.active { background: #5a9e8a; }
  }

  .project-desc {
    @apply text-[12px] leading-relaxed mb-3;
    color: #888;
  }

  .project-lang {
    @apply text-[10px] font-mono tracking-wide;
    color: #bbb;
  }

  /* More card */
  .more-card {
    @apply flex items-center justify-center rounded-2xl
    text-[10px] font-mono tracking-[0.14em] no-underline
    border border-black/[0.06] transition-colors duration-200
    min-h-[80px];
    background: rgba(0,0,0,0.03);
    color: #aaa;

    &:hover { color: #555; }
  }

  /* Academia */
  .academia-layout {
    @apply grid gap-8 md:gap-10;
    grid-template-columns: 1fr 2fr;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .interests-list {
    @apply flex flex-col gap-2 items-start;
  }

  .interest-tag {
    @apply text-[11px] font-mono tracking-wide rounded-full px-3 py-1.5;
    background: rgba(0,0,0,0.06);
    color: #555;
  }

  .pubs-list {
    @apply flex flex-col gap-2.5;
  }

  .pub-card {
    @apply block bg-white rounded-xl px-4 py-3.5 no-underline
    border border-black/[0.06] transition-colors duration-200;

    &:hover { @apply border-black/20; }
  }

  .pub-title {
    @apply text-[13px] font-semibold leading-snug mb-1;
    color: #1a1a1a;
  }

  .pub-venue {
    @apply text-[10px] font-mono tracking-wide mb-0.5;
    color: #5a9e8a;
  }

  .pub-authors {
    @apply text-[10px] font-mono tracking-wide;
    color: #bbb;
  }

  /* About */
  .about-preview {
    @apply flex flex-col gap-6 max-w-xl;
  }

  .about-body {
    @apply text-[15px] leading-relaxed;
    color: #555;
  }

  .about-cta {
    @apply text-[11px] font-mono tracking-[0.12em] no-underline;
    color: #888;

    &:hover { color: #1a1a1a; }
  }
</style>