import type { Env } from '../_lib/session';
import { getSessionUser } from '../_lib/session';

interface UnitProgressRow {
	unit_id: string;
	status: string;
	steps_completed: number;
	steps_total: number;
	updated_at: string;
}

// GET /api/progress — list the logged-in student's progress across all units
// (the data behind a ChillJudge-style "learning map").
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	const user = await getSessionUser(request, env);
	if (!user) return Response.json({ error: 'not_logged_in' }, { status: 401 });

	const { results } = await env.DB.prepare(
		`SELECT unit_id, status, steps_completed, steps_total, updated_at
		 FROM unit_progress WHERE user_id = ? ORDER BY updated_at DESC`
	)
		.bind(user.id)
		.all<UnitProgressRow>();

	return Response.json({ progress: results });
};

interface ProgressUpdateBody {
	unitId: string;
	stepsCompleted: number;
	stepsTotal: number;
	status?: 'in_progress' | 'completed';
}

// POST /api/progress — upsert progress for one unit.
// Body: { unitId, stepsCompleted, stepsTotal, status? }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	const user = await getSessionUser(request, env);
	if (!user) return Response.json({ error: 'not_logged_in' }, { status: 401 });

	const body = (await request.json()) as ProgressUpdateBody;
	if (!body.unitId || typeof body.stepsCompleted !== 'number' || typeof body.stepsTotal !== 'number') {
		return Response.json({ error: 'invalid_body' }, { status: 400 });
	}
	const status = body.status ?? (body.stepsCompleted >= body.stepsTotal ? 'completed' : 'in_progress');

	await env.DB.prepare(
		`INSERT INTO unit_progress (user_id, unit_id, status, steps_completed, steps_total, updated_at)
		 VALUES (?, ?, ?, ?, ?, datetime('now'))
		 ON CONFLICT(user_id, unit_id) DO UPDATE SET
		   status = excluded.status,
		   steps_completed = excluded.steps_completed,
		   steps_total = excluded.steps_total,
		   updated_at = datetime('now')`
	)
		.bind(user.id, body.unitId, status, body.stepsCompleted, body.stepsTotal)
		.run();

	return Response.json({ ok: true });
};
