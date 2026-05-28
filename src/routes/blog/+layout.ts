import type { LayoutLoad } from './$types';

type PostMetadata = {
	title: string;
	tags?: string[];
	category?: string;
};

export const load: LayoutLoad = async () => {
	// 1. Fetch all markdown files
	const modules = import.meta.glob('/src/lib/assets/blog/**/*.md', { eager: true });

	// 2. Map them into a clean array
	const posts = Object.entries(modules).map(([path, module]) => {
		const post = module as { metadata: PostMetadata };

		// Extract the slug from the filename
		const filename = path.split('/').pop();
		const slug = filename?.replace('.md', '');

		return {
			title: post.metadata.title,
			slug: slug,
			// Group by a 'category' field, fallback to the first tag, or default to 'Articles'
			category: post.metadata.category || 'Misc'
		};
	});

	// 3. Group the posts by category using reduce
	const groupedPosts = posts.reduce((acc, post) => {
		if (!acc[post.category]) {
			acc[post.category] = [];
		}
		acc[post.category].push(post);
		return acc;
	}, {} as Record<string, typeof posts>);

	// Return the grouped object to the layout
	return {
		groupedPosts
	};
};