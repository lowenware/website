import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ strict: true }),
    alias: {
      $lib: 'src/lib'
    },
    prerender: {
      handleHttpError: 'warn',
      handleMissingId: 'warn',
      handleUnseenRoutes: 'warn',
      entries: ['/', '/en/', '/cs/', '/sitemap.xml']
    }
  }
};

export default config;
