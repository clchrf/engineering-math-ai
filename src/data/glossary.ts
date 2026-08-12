// Single source of truth for concept definitions — used both by the
// dedicated /glossary page (server-rendered) and by the in-lecture "concept
// chip" modal on unit pages (client-side), so every unit's hard terms live
// in one consolidated place instead of being duplicated per page.
export interface GlossaryEntry {
	id: string;
	unit: string; // which unit introduced this term, for grouping on the glossary page
	title: { zh: string; en: string };
	body: { zh: string; en: string };
}

export const glossary: GlossaryEntry[] = [
	{
		id: 'de',
		unit: 'separable-equation',
		title: { zh: '微分方程式', en: 'Differential Equation' },
		body: {
			zh: '一個「方程式」，裡面除了未知函數 y 本身，還包含 y 的導數（例如 dy/dx）。解微分方程式，就是要找出滿足這個關係的函數 y(x) 本身，而不是找一個數字。例如 dy/dx = y/(1+x) 就是一個微分方程式，答案是一整個函數 y = C(1+x)，不是一個數字。',
			en: 'An equation that involves not just the unknown function y, but also its derivatives (like dy/dx). Solving one means finding the function y(x) itself that satisfies the relationship — not a single number. For example, dy/dx = y/(1+x) is a differential equation; its answer is a whole function, y = C(1+x), not a number.',
		},
	},
	{
		id: 'general-particular',
		unit: 'separable-equation',
		title: { zh: '通解與特解', en: 'General vs. Particular Solution' },
		body: {
			zh: '通解（general solution）是包含任意常數 C 的完整解，代表「所有」滿足這個微分方程式的函數，例如 y = C(1+x)。特解（particular solution）則是給定初始條件（例如 y(0) = 5）之後，代入求出特定的 C 值，得到「一條」具體的曲線。同一個微分方程式的通解只有一個，但特解可以有無限多條，取決於初始條件。',
			en: 'The general solution (with an arbitrary constant C, like y = C(1+x)) represents every function that satisfies the differential equation. A particular solution is what you get after plugging in an initial condition (like y(0) = 5) to solve for a specific C — one concrete curve out of that whole family. There’s only one general solution, but infinitely many particular ones.',
		},
	},
	{
		id: 'const-of-integration',
		unit: 'separable-equation',
		title: { zh: '積分常數 C', en: 'Constant of Integration C' },
		body: {
			zh: '對一個函數積分時，導數為 0 的常數項會「消失」，所以逆運算（積分）沒辦法把它找回來——只能用一個未知的常數 C 代表「所有可能遺漏掉的常數」。這就是為什麼解微分方程式時，兩邊積分完一定要加上 +C，少了它，你只找到其中一條解，而不是全部的解。',
			en: 'When you differentiate a function, any constant term vanishes (its derivative is 0) — so integrating can’t recover it. That’s what the +C stands for: "whatever constant might have been there." Forget it when integrating both sides of a differential equation, and you only find one solution instead of the whole family.',
		},
	},
	{
		id: 'implicit-explicit',
		unit: 'separable-equation',
		title: { zh: '隱函數與顯函數', en: 'Implicit vs. Explicit Form' },
		body: {
			zh: '顯函數（explicit）長得像「y = ...」，可以直接代入 x 算出 y。隱函數（implicit）像 ln|y| = ln|1+x| + C，y 被「藏」在算式裡面，沒有直接寫出來。解微分方程式時，積分後常常會先得到隱函數形式，需要再做一步代數（例如兩邊取 exp）才能整理成顯函數，方便之後計算或畫圖。',
			en: 'An explicit form looks like "y = ...", where you can plug in x and get y directly. An implicit form, like ln|y| = ln|1+x| + C, has y "hidden" inside the equation rather than isolated. After integrating a differential equation you often land in implicit form first, and need one more algebra step (like exponentiating both sides) to reach the explicit form that’s easier to compute or graph with.',
		},
	},
];

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
	return glossary.find((e) => e.id === id);
}
