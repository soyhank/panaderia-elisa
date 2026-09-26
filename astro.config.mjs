import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://panaderia-elisa.vercel.app',
  adapter: vercel(),
  integrations: [sitemap({ filter: (p) => !p.includes('/admin') })],
  security: { checkOrigin: true },
  vite: { plugins: [tailwindcss()] },
});
