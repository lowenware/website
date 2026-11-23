import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({ strict: true }),
      prerender: {
        handleHttpError: 'warn',
        handleMissingId: 'warn',
        handleUnseenRoutes: 'warn',
        entries: ['/', '/en/', '/cs/', '/sitemap.xml']
      }
    })
  ],
  server: { port: 8080 }
});
