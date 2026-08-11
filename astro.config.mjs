// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
//
// Hosting: Cloudflare Pages (connected to this GitHub repo via Cloudflare's
// dashboard — Workers & Pages > Create > Pages > Connect to Git). Cloudflare
// builds and deploys automatically on every push, no GitHub Actions needed.
// Backend logic (auth, progress) lives in /functions as Cloudflare Pages
// Functions, deployed alongside this static build. Update `site` once you
// know your Pages URL or custom domain.
export default defineConfig({
	site: 'https://your-project.pages.dev',
});
