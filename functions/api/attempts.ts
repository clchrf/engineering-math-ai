import type { Env } from '../_lib/session';
import { getSessionUser } from '../_lib/session';

interface AttemptBody {
	unitId: string;
	itemId: string;
	isCorrect: boolean;
	submittedValue?: string;
}

// POST /api/attempts — log one graded attempt (a quiz answer or a solver step).
// Body: { unitId, itemId, isCorrect, submittedValue? }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
	const user = await getSessionUser(request, env);
	if (!user) return Response.json({ error: 'not_logged_in' }, { status: 401 });

	const body = (await request.json()) as AttemptBody;
	if (!body.unitId || !body.itemId || typeof body.isCorrect !== 'boolean') {
		return Response.json({ error: 'invalid_body' }, { status: 400 });
	}

	await env.DB.prepare(
		`INSERT INTO attempts (user_id, unit_id, item_id, is_correct, submitted_value)
		 VALUES (?, ?, ?, ?, ?)`
	)
		.bind(user.id, body.unitId, body.itemId, body.isCorrect ? 1 : 0, body.submittedValue ?? null)
		.run();

	return Response.json({ ok: true });
};
