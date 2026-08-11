import type { Env } from '../../_lib/session';
import { readCookie, createSession, clearCookieHeader } from '../../_lib/session';

interface GoogleTokenResponse {
	id_token: string;
	access_token: string;
}

interface GoogleTokenInfo {
	sub: string;
	email: string;
	name?: string;
	picture?: string;
	aud: string;
}

// GET /api/auth/callback — Google redirects here after the user consents.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expectedState = readCookie(request, 'oauth_state');

	if (!code || !state || !expectedState || state !== expectedState) {
		return new Response('Invalid OAuth state.', { status: 400 });
	}

	const redirectUri = `${url.origin}/api/auth/callback`;
	const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			code,
			client_id: env.GOOGLE_CLIENT_ID,
			client_secret: env.GOOGLE_CLIENT_SECRET,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
		}),
	});
	if (!tokenRes.ok) {
		return new Response('Google token exchange failed.', { status: 502 });
	}
	const tokens = (await tokenRes.json()) as GoogleTokenResponse;

	// Let Google verify the id_token's signature/expiry/audience for us — simplest
	// correct option for a low-traffic app. (For high traffic, switch to local
	// JWKS verification to avoid the extra request.)
	const verifyRes = await fetch(
		`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`
	);
	if (!verifyRes.ok) {
		return new Response('Google id_token verification failed.', { status: 401 });
	}
	const info = (await verifyRes.json()) as GoogleTokenInfo;
	if (info.aud !== env.GOOGLE_CLIENT_ID) {
		return new Response('Token audience mismatch.', { status: 401 });
	}

	// Upsert the user.
	const existing = await env.DB.prepare(`SELECT id FROM users WHERE google_sub = ?`)
		.bind(info.sub)
		.first<{ id: string }>();

	let userId: string;
	if (existing) {
		userId = existing.id;
		await env.DB.prepare(`UPDATE users SET email = ?, name = ?, avatar_url = ? WHERE id = ?`)
			.bind(info.email, info.name ?? null, info.picture ?? null, userId)
			.run();
	} else {
		userId = crypto.randomUUID();
		await env.DB.prepare(
			`INSERT INTO users (id, google_sub, email, name, avatar_url) VALUES (?, ?, ?, ?, ?)`
		)
			.bind(userId, info.sub, info.email, info.name ?? null, info.picture ?? null)
			.run();
	}

	const sessionCookie = await createSession(env, userId);

	const headers = new Headers({ Location: `${url.origin}/` });
	headers.append('Set-Cookie', sessionCookie);
	// Clear the CSRF-guard cookie now that it's served its purpose.
	headers.append('Set-Cookie', clearCookieHeader('oauth_state'));

	return new Response(null, { status: 302, headers });
};
