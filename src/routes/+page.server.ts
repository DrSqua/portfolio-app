import type { PageServerLoad } from './$types';
import { ServerBlogService } from '$lib/services/blogService.server';

export const load: PageServerLoad = () => {
	return {
		recentBlogs: ServerBlogService.getRecentBlogs(5)
	};
};