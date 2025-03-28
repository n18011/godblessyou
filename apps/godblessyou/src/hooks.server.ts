import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { json } from '@sveltejs/kit';

const handleParaglide: Handle = async ({ event, resolve }) => {
	// Handle health check endpoint directly
	if (event.url.pathname === '/health') {
		return json({
			status: 'ok',
			timestamp: new Date().toISOString()
		});
	}

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});
};

export const handle: Handle = handleParaglide;
