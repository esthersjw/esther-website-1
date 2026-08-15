import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

function staticDirectoryIndex() {
  return {
    name: 'static-directory-index',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = request.url;
        if (!url || !url.endsWith('/')) return next();

        const pathname = decodeURIComponent(url.split('?')[0]);
        const indexFile = resolve(process.cwd(), 'public', `.${pathname}`, 'index.html');
        if (existsSync(indexFile)) request.url = `${url}index.html`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [staticDirectoryIndex()],
});
