import { ServerBlogService } from '$lib/services/blogService.server';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const blogMeta = ServerBlogService.getBlogBySlug(params.slug);
	if (!blogMeta) {
		throw error(404, `Blog post not found: ${params.slug}`);
	}
	return { blogMeta };
};