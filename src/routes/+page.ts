import type { PageLoad } from './$types';

type PostMetadata = {
	title: string;
	date: string;
	description: string;
	tags: string[];
};

export const load: PageLoad = async () => {
	
	// 1. Get the compiled modules (for frontmatter)
	const modules = import.meta.glob('/src/lib/assets/blog/**/*.md', { eager: true });
	// 2. Get the raw text of the files (for accurate read time calculation)
	const rawFiles = import.meta.glob('/src/lib/assets/blog/**/*.md', { query: '?raw', eager: true });
	// 3. Map over the files and extract the data
	let recentBlogs = Object.entries(modules).map(([path, module]) => {
		const post = module as { metadata: PostMetadata };

		// Extract the slug from the filename
		const filename = path.split('/').pop();
		const slug = filename?.replace('.md', '');

		// FIX: Extract the 'default' property from the raw file module
		const rawContent = (rawFiles[path] as { default: string }).default;

		const wordCount = rawContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
		const readTime = Math.max(1, Math.ceil(wordCount / 200));

		return {
			name: post.metadata.title,
			link: `/blog/${slug}`,
			date: post.metadata.date,
			tags: post.metadata.tags || [],
			readTime: readTime
		};
	});

	// 4. Sort the blogs from newest to oldest
	recentBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		recentBlogs: recentBlogs.slice(0, 3)
	};
};