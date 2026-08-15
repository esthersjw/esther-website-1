# Esther Website

The homepage is a React application built with Vite. Its existing visual language and interaction timings are intentionally preserved during the migration.

## Development

```bash
npm install
npm run dev
```

Create a production deployment with:

```bash
npm run build
```

## Project Structure

- `src/App.jsx`: React application entry and lifecycle boundary.
- `src/content/home.html`: Homepage's declarative document structure, separated from behavior for safe content updates.
- `src/styles/site.css`: Homepage styles and animation definitions.
- `src/lib/siteController.js`: Homepage interaction controller: tabs, terminal launch, desktop windows, canvas loading, pointer interactions, and exit loop.
- `public/`: Static assets plus existing tutorial, playground, and canvas pages. These retain their published URLs, including `/tutorials/...` and `/A-infinite-canvas-v2.html`.

## Updating The Homepage

Keep structural changes in `src/content/home.html`, visual changes in `src/styles/site.css`, and interaction changes in `src/lib/siteController.js`. Build after each change to catch module and asset issues.
