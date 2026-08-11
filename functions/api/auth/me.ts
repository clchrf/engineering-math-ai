import type { Env } from '../../_lib/session';
import { getSessionUser } from '../../_lib/session';

// GET /api/auth/me — return the logged-in user, or { user: null } if not logged in.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	const user = await getSessionUser(request, env);
	return Response.json({ user });
};
