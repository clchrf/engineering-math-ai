// Shared language persistence so the course home and every unit page agree on
// which language to show, without needing a server round-trip.
export type Lang = 'zh' | 'en';

const STORAGE_KEY = 'math-course-lang';

export function getStoredLang(): Lang {
	if (typeof localStorage === 'undefined') return 'zh';
	const v = localStorage.getItem(STORAGE_KEY);
	return v === 'en' ? 'en' : 'zh';
}

export function setStoredLang(lang: Lang): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, lang);
}
