// Client-side progress tracking (localStorage only — no login/backend
// required). Lets the course homepage show real completion state and makes
// coming back to the site feel like it remembers you, without needing the
// Cloudflare D1 backend that isn't deployed yet.
export type UnitStatus = 'not_started' | 'in_progress' | 'completed';

const KEY_PREFIX = 'math-course-progress:';
const RANK: Record<UnitStatus, number> = { not_started: 0, in_progress: 1, completed: 2 };

export function getUnitStatus(unitId: string): UnitStatus {
	if (typeof localStorage === 'undefined') return 'not_started';
	const v = localStorage.getItem(KEY_PREFIX + unitId);
	return v === 'completed' || v === 'in_progress' ? v : 'not_started';
}

// Status only ever moves forward (never downgrades a completed unit back to
// in_progress just because the student revisits it).
export function setUnitStatus(unitId: string, status: UnitStatus): void {
	if (typeof localStorage === 'undefined') return;
	const current = getUnitStatus(unitId);
	if (RANK[status] <= RANK[current]) return;
	localStorage.setItem(KEY_PREFIX + unitId, status);
}

export function getAllProgress(unitIds: string[]): Record<string, UnitStatus> {
	const out: Record<string, UnitStatus> = {};
	for (const id of unitIds) out[id] = getUnitStatus(id);
	return out;
}
