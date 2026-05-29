// frontmatter as it comes from the markdown file
export interface BlogFrontmatter {
	title: string;
	date: string;
	preview_description?: string;
	description?: string;
	tags?: string[];
	category?: string;
}

export interface BlogMetaI {
	title: string;
	slug: string;
	link: string;
	date: string;
	preview_description: string;
	description: string;
	tags: string[];
	category: string;
	readTime: number;
}