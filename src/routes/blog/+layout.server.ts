import { ServerBlogService } from '$lib/services/blogService.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
	return {
		groupedPosts: ServerBlogService.getGroupedBlogs()
	};
};