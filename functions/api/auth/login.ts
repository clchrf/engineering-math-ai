import type { Env } from '../../_lib/session';
import { randomToken, setCookieHeader } from '../../_lib/session';

// GET /api/auth/login — redirect the browser to Google's consent screen.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	const url = new URL(request.url);
	const redirectUri = `${url.origin}/api/auth/callback`;
	const state = await randomToken();

	const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	authUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
	authUrl.searchParams.set('redirect_uri', redirectUri);
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('scope', 'openid email profile');
	authUrl.searchParams.set('state', state);
	authUrl.searchParams.set('prompt', 'select_account');

	return new Response(null, {
		status: 302,
		headers: {
			Location: authUrl.toString(),
			// Short-lived cookie to check against the state Google echoes back (CSRF guard).
			'Set-Cookie': setCookieHeader('oauth_state', state, 600),
		},
	});
};
