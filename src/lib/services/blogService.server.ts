import type { BlogFrontmatter, BlogMetaI } from '$lib/models/blog';


export class ServerBlogService {
	/**
	 * modules (the yaml format at the top)
	 * rawfile (the raw content of the whole text)
	 * Are both evaluated at compile time (because of 'eager: true') so we declare as static variables
	 */
	private static modules = import.meta.glob('/src/lib/assets/blog/**/*.md', { eager: true });
	private static rawFiles = import.meta.glob('/src/lib/assets/blog/**/*.md', { query: '?raw', eager: true });
	private static postsCache: BlogMetaI[] | null = null; // cache to avoid re-running logic

	static fetchAllBlogs(): BlogMetaI[] {
		if (this.postsCache) return this.postsCache;
		const posts: BlogMetaI[] = [];

		for (const [path, module] of Object.entries(this.modules)) {
			try {
				const post = module as { metadata: BlogFrontmatter };

				// Metadata check
				if (!post || !post.metadata || !post.metadata.title || !post.metadata.date) {
					throw new Error("Missing required YAML frontmatter (needs at least 'title' and 'date')");
				}

				const rawContent = (this.rawFiles[path] as { default: string }).default;
				posts.push(this.parseModule(path, post.metadata, rawContent));
			} catch (error) {
				// todo once we integrate sentry, log the error here
				console.error(`[ServerBlogService] Skipped invalid blog post (${path}):`, error);
			}
		}

		posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		this.postsCache = posts;
		return this.postsCache;
	}

	static parseModule(path: string, metadata: BlogFrontmatter, rawContent: string): BlogMetaI {
		const filename = path.split('/').pop();
		const slug = filename?.replace('.md', '') || '';

		const wordCount = rawContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
		const readTime = Math.max(1, Math.ceil(wordCount / 200));

		return {
			title: metadata.title,
			slug: slug,
			link: `/blog/${slug}`,
			date: metadata.date,
			preview_description: metadata.preview_description || '',
			description: metadata.description || '',
			tags: metadata.tags || [],
			category: metadata.category || 'Articles',
			readTime: readTime
		};
	}

	static getBlogBySlug(slug: string): BlogMetaI | undefined {
		return this.fetchAllBlogs().find(blog => blog.slug === slug);
	}

	static getRecentBlogs(limit: number = 3): BlogMetaI[] {
		return this.fetchAllBlogs().slice(0, limit);
	}

	static getGroupedBlogs(): Record<string, BlogMetaI[]> {
		const posts = this.fetchAllBlogs();
		return posts.reduce((acc, post) => {
			if (!acc[post.category]) {
				acc[post.category] = [];
			}
			acc[post.category].push(post);
			return acc;
		}, {} as Record<string, BlogMetaI[]>);
	}
}