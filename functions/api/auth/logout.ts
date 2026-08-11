import type { Env } from '../../_lib/session';
import { destroySession } from '../../_lib/session';

// POST /api/auth/logout — clear the session server-side and the cookie client-side.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	const cookie = await destroySession(request, env);
	return new Response(null, { status: 204, headers: { 'Set-Cookie': cookie } });
};
