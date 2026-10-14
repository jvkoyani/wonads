import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wonads.com',
  // Output services.html (not services/index.html) so the live server's existing
  // .htaccess keeps serving clean URLs like https://wonads.com/services.
  build: { format: 'file' },
  trailingSlash: 'never',
  devToolbar: { enabled: false },
});
