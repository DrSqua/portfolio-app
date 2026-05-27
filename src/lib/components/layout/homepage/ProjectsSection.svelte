<script>
  import { onMount } from 'svelte';

  const projects = [
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
      name: 'Go Dynamic QR Code',
      tags: ['System Design', 'Distributed System'],
      description: 'Simple web based go application for QR redirecting.',
      link: '/projects/go-dynamic-qrcode',
      year: '2024',
      stack: ['Go', 'Azure'],
    },
    {
      name: 'This website',
      tags: ['Website', 'Hosting'],
      description: "A bit cliché, but this portfolion website is also one of the projects I've invested quite some time in.",
      link: '/projects/portfolio-app',
      year: '2024',
      stack: ['SvelteKit', 'Cloudflare'],
    },
    {
      name: 'Homelab',
      tags: ['Homelab', 'Hosting'],
      description: "Like every self-respecting software developer, I am somehow fell into the trap of developing a homelab.",
      link: '/projects/homelab',
      year: '2025-now',
      stack: ['Proxmox', 'LXC', 'K3S'],
    }
  ];

  let activeIndex = $state(0);
  let sectionEl = $state();

  let sectionTop = 0;
  let totalScrollable = 0;

  function calculateLayout() {
    if (!sectionEl) return;
    const rect = sectionEl.getBoundingClientRect();
    sectionTop = rect.top + window.scrollY;
    totalScrollable = sectionEl.offsetHeight - window.innerHeight;
  }

  onMount(() => {
    calculateLayout();
  });

  function handleScroll() {
    if (totalScrollable <= 0) return;
    const scrolledIntoSection = window.scrollY - sectionTop;
    const progress = Math.max(0, Math.min(1, scrolledIntoSection / totalScrollable));

    activeIndex = Math.min(
      projects.length - 1,
      Math.floor(progress * projects.length)
    );
  }
</script>

<svelte:window onscroll={handleScroll} onresize={calculateLayout} />

<section
  bind:this={sectionEl}
  style="--project-count: {projects.length};"
  class="relative h-auto md:h-[calc(var(--project-count)*50vh+100vh)]"
>
  <div class="static md:absolute inset-0">

    <div class="static md:sticky top-0 h-auto md:h-screen grid grid-cols-1 md:grid-cols-2 overflow-visible md:overflow-hidden">

      <div class="flex flex-col justify-center px-6 pt-12 pb-8 border-b border-white/5 md:border-b-0 md:border-r md:px-12 md:py-16 lg:pl-12 lg:pr-16">
        <p class="text-[11px] font-mono tracking-[0.2em] text-white/30 uppercase mb-8">
          projects
        </p>
        <h2 class="text-[clamp(2.5rem,4vw,3.5rem)] font-black text-white leading-[1.05] tracking-[-0.03em] mb-6">
          Things I've<br />built & shipped.
        </h2>
        <p class="text-[15px] text-white/45 leading-relaxed max-w-[380px] mb-8 md:mb-12">
          A mix of open-source tools, experiments, and side projects. Some are
          maintained, some are frozen in time — all of them taught me something.
        </p>
        <div class="hidden md:flex items-center gap-3 font-mono">
          <span class="text-4xl font-bold text-white/90 leading-none transition-all duration-300 min-w-[3ch]">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span class="block w-8 h-[0.5px] bg-white/20"></span>
          <span class="text-base text-white/20 leading-none">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div class="flex flex-col md:flex-row md:relative items-center justify-center gap-4 md:gap-0 px-6 py-8 md:pl-16 md:pr-12">
        {#each projects as project, i (project.name)}
          <div
            class="w-full md:max-w-2xl md:px-12 md:absolute transition-all duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)]
            {i === activeIndex
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : i < activeIndex
                ? 'md:opacity-0 md:-translate-y-10 md:pointer-events-none'
                : 'md:opacity-0 md:translate-y-10 md:pointer-events-none'
                }"
          >
            <div class="bg-white/5 border border-white/10 rounded-2xl px-6 py-6 md:px-8 md:pt-8 md:pb-7">
              <div class="flex justify-between items-center mb-5">
                <p class="text-[10px] font-mono tracking-[0.12em] text-[#64d2b4]/70">
                  {project.tags.join(" • ")}
                </p>
                <p class="text-[11px] font-mono text-white/20">
                  {project.year}
                </p>
              </div>
              <h3 class="text-2xl font-extrabold text-white tracking-tight mb-4 leading-none">
                {project.name}
              </h3>
              <p class="text-sm text-white/50 leading-relaxed mb-7">
                {project.description}
              </p>
              <div class="flex items-center justify-between gap-4">
                <div class="flex flex-wrap gap-1.5">
                  {#each project.stack as tech}
                    <span class="text-[10px] font-mono tracking-wider text-white/40 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                      {tech}
                    </span>
                  {/each}
                </div>
                <a href={project.link} class="text-xs font-mono tracking-wider text-white/40 hover:text-white/90 whitespace-nowrap transition-colors duration-200" target="_blank" rel="noopener">
                  view project ↗
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>

    </div>
  </div>
</section>