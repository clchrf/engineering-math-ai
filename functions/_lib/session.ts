// Shared helpers for cookie-based sessions, used by every function under /functions/api/*.

export interface Env {
	DB: D1Database;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	SESSION_SECRET: string;
}

const SESSION_COOKIE = 'session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function readCookie(request: Request, name: string): string | null {
	const header = request.headers.get('Cookie') ?? '';
	const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
	return match ? decodeURIComponent(match[1]) : null;
}

export function setCookieHeader(name: string, value: string, maxAgeSeconds: number): string {
	return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function clearCookieHeader(name: string): string {
	return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function randomToken(): Promise<string> {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export interface SessionUser {
	id: string;
	email: string;
	name: string | null;
	avatar_url: string | null;
}

/** Look up the logged-in user from the session cookie, or null if not logged in / expired. */
export async function getSessionUser(request: Request, env: Env): Promise<SessionUser | null> {
	const token = readCookie(request, SESSION_COOKIE);
	if (!token) return null;

	const row = await env.DB.prepare(
		`SELECT u.id, u.email, u.name, u.avatar_url
		 FROM sessions s JOIN users u ON u.id = s.user_id
		 WHERE s.token = ? AND s.expires_at > datetime('now')`
	)
		.bind(token)
		.first<SessionUser>();

	return row ?? null;
}

/** Create a new session row for a user and return the Set-Cookie header value. */
export async function createSession(env: Env, userId: string): Promise<string> {
	const token = await randomToken();
	await env.DB.prepare(
		`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))`
	)
		.bind(token, userId)
		.run();
	return setCookieHeader(SESSION_COOKIE, token, SESSION_TTL_SECONDS);
}

export async function destroySession(request: Request, env: Env): Promise<string> {
	const token = readCookie(request, SESSION_COOKIE);
	if (token) {
		await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run();
	}
	return clearCookieHeader(SESSION_COOKIE);
}

export { SESSION_COOKIE };
