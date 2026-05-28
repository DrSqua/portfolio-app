import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	// 1. Glob for the compiled components
	const posts = import.meta.glob('/src/lib/assets/blog/**/*.md');
	// 2. Glob for the raw text strings (note the ?raw query)
	const rawPosts = import.meta.glob('/src/lib/assets/blog/**/*.md', { query: '?raw' });

	const targetPath = `/src/lib/assets/blog/${params.slug}/${params.slug}.md`;

	if (!posts[targetPath]) {
		throw error(404, `Could not find the post: ${params.slug}`);
	}

	try {
		// Load the compiled component
		const post = await posts[targetPath]() as { default: any, metadata: any };

		// Load the raw string
		const rawPost = await rawPosts[targetPath]() as { default: string };

		// 3. Calculate read time directly in the load function
		const rawContent = rawPost.default;
		const wordCount = rawContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
		const readTime = Math.max(1, Math.ceil(wordCount / 200));

		return {
			content: post.default,
			meta: post.metadata,
			readTime: readTime
		};
	} catch (e) {
		console.error(`Failed to execute mdsvex import for ${params.slug}:`, e);
		throw error(500, `Error loading the post: ${params.slug}`);
	}
};