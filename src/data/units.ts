export interface Unit {
	id: string;
	category: string;
	categoryEn: string;
	title: string;
	titleEn: string;
	blurb: string;
	blurbEn: string;
	icon: string;
	href: string | null; // null = not built yet
}

export const categories = [
	{ id: 'ode', zh: '常微分方程基礎', en: 'ODE Foundations' },
	{ id: 'laplace', zh: 'Laplace 轉換', en: 'Laplace Transform' },
	{ id: 'fourier', zh: '傅立葉級數', en: 'Fourier Series' },
] as const;

export const units: Unit[] = [
	{
		id: 'separable-equation',
		category: 'ode',
		categoryEn: 'ode',
		title: '可分離變數方程式',
		titleEn: 'Separable Equations',
		blurb: '從牛頓冷卻定律出發，學會拆解、積分、驗證解答',
		blurbEn: 'Starting from Newton\'s law of cooling — separate, integrate, verify',
		icon: '∫',
		href: '/units/separable-equation',
	},
	{
		id: 'exact-linear',
		category: 'ode',
		categoryEn: 'ode',
		title: '正合方程式與線性方程式',
		titleEn: 'Exact & Linear Equations',
		blurb: '判斷正合條件，用積分因子解一階線性方程式',
		blurbEn: 'Test for exactness, and solve with an integrating factor',
		icon: 'M',
		href: null,
	},
	{
		id: 'second-order',
		category: 'ode',
		categoryEn: 'ode',
		title: '二階微分方程式',
		titleEn: 'Second-Order ODEs',
		blurb: '從一階邁向二階，建立齊次解的基本概念',
		blurbEn: 'From first to second order — building the homogeneous solution',
		icon: 'y″',
		href: null,
	},
	{
		id: 'second-order-constant',
		category: 'ode',
		categoryEn: 'ode',
		title: '二階常係數微分方程式',
		titleEn: '2nd-Order, Constant Coefficients',
		blurb: '特徵方程式、重根與複根，三種情況一次搞懂',
		blurbEn: 'The characteristic equation — real, repeated, and complex roots',
		icon: 'r²',
		href: null,
	},
	{
		id: 'nonhomogeneous',
		category: 'ode',
		categoryEn: 'ode',
		title: '非齊次常係數微分方程式',
		titleEn: 'Nonhomogeneous, Constant Coefficients',
		blurb: '未定係數法與參數變異法，找出特解',
		blurbEn: 'Undetermined coefficients and variation of parameters',
		icon: 'y_p',
		href: null,
	},
	{
		id: 'laplace-1',
		category: 'laplace',
		categoryEn: 'laplace',
		title: 'Laplace 轉換（一）：定義與基本函數',
		titleEn: 'Laplace Transform I: Definitions',
		blurb: '從積分定義出發，建立第一張轉換對照表',
		blurbEn: 'From the integral definition to your first transform table',
		icon: 'ℒ',
		href: null,
	},
	{
		id: 'laplace-2',
		category: 'laplace',
		categoryEn: 'laplace',
		title: 'Laplace 轉換（二）：微分性質與解 DE',
		titleEn: 'Laplace Transform II: Derivatives & Solving DEs',
		blurb: '把微分方程式轉成代數問題，再轉換回來',
		blurbEn: 'Turn a DE into algebra, then transform back',
		icon: 'ℒ',
		href: null,
	},
	{
		id: 'laplace-3',
		category: 'laplace',
		categoryEn: 'laplace',
		title: 'Laplace 轉換（三）：部分分式與應用',
		titleEn: 'Laplace Transform III: Partial Fractions',
		blurb: '快速分解法，處理重根與複根的情況',
		blurbEn: 'The fast decomposition trick — repeated and complex roots',
		icon: 'ℒ',
		href: null,
	},
	{
		id: 'fourier-series',
		category: 'fourier',
		categoryEn: 'fourier',
		title: '傅立葉級數',
		titleEn: 'Fourier Series',
		blurb: '用正弦與餘弦的組合，重現任何週期函數',
		blurbEn: 'Rebuilding any periodic function from sines and cosines',
		icon: '∼',
		href: null,
	},
];
