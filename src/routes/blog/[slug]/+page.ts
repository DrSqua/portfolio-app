import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	// Only glob for the compiled Svelte components
	const posts = import.meta.glob('/src/lib/assets/blog/**/*.md');
	const targetPath = `/src/lib/assets/blog/${params.slug}/${params.slug}.md`;
	if (!posts[targetPath]) {
		throw error(404, `Could not find the component for: ${params.slug}`);
	}

	try {
		const post = await posts[targetPath]() as { default: any };
		return {
			meta: data.blogMeta,
			content: post.default
		};
	} catch (e) {
		console.error(`Failed to execute component import for ${params.slug}:`, e);
		throw error(500, `Error rendering the post: ${params.slug}`);
	}
};