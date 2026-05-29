<script lang="ts">
	import type { PageData } from './$types';
	import { prettyDateSpelled } from '$lib/style-utils';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.preview_description} />
</svelte:head>

<article class="flex flex-col items-center">
	<div class="w-full max-w-3xl mb-4 bg-[#64d2b4]/5 border border-[#64d2b4]/20 rounded-2xl px-6 py-6">
		<div class="flex justify-between items-center mb-5">
			<p class="text-[10px] font-mono tracking-[0.12em] text-[#64d2b4]">
				{data.meta.tags.join(" • ")}
			</p>
		</div>

		<h1 class="text-7xl font-bold text-surface text-center">
			{data.meta.title}
		</h1>
		<p class="max-w-2xl text-md mt-4 text-[#64d2b4]">{data.meta.description}</p>

		<div class="flex items-center justify-between mt-8">
			<p class="text-sm text-gray-500 leading-relaxed">
				{prettyDateSpelled(data.meta.date)}
			</p>

			<p class="text-sm text-gray-500 leading-relaxed">
				{data.meta.readTime} min read
			</p>
		</div>
	</div>

	<article class="prose prose-teal mx-auto w-full max-w-3xl prose-base md:prose-xl">
		<data.content />
	</article>
</article>