export const prettyDateSpelled = (input_str: string): string => {
	// Automatically converts to local timezone
	return new Date(input_str).toLocaleDateString('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	})
};