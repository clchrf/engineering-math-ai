// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// Hosting: GitHub Pages, deployed via the workflow in
// .github/workflows/deploy.yml on every push to main/master. Served at
// https://clchrf.github.io/engineering-math-ai/, so `base` must match the
// repo name — every internal link/asset in the codebase reads
// `import.meta.env.BASE_URL` rather than hardcoding a leading "/" so it
// keeps working if the repo is ever renamed or moved to a custom domain.
//
// (Cloudflare Pages Functions in /functions still exist for a future
// backend, but GitHub Pages can't run them — API calls fail silently and
// the site works standalone without login/progress persistence.)
export default defineConfig({
	site: 'https://clchrf.github.io',
	base: '/engineering-math-ai/',
});
