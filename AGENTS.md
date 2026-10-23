# MycelForge repository guide

## Source layout
- `src/lib/mycel/` is the engine used by the web app.
- `src/components/mycel/` is the web interface.
- `mycelforge/src/lib/mycel/` is the portable CLI package's engine copy.
- `mycelforge/studio/` contains portable UI and route copies. The copies are deliberate; never edit only one side.
- `pages.html`, `src/pages-main.tsx`, and `vite.config.pages.ts` form the static Pages build. The built output is published by the website repository's `.github/workflows/mycelforge-publish.yml` into `/mycelforge/`.

## Required checks
Use Node.js 22 or later. Before publishing, run:
```sh
npm ci
npm test
npm run typecheck
npm run check:mycel-mirrors
npm run check:forge-cli
npm run test:mycel
npm run build:pages
```

The `check:mycel-mirrors` script catches drift between the web engine/UI and the portable copies. Update corresponding files together.

## Product and scientific claims
MycelForge is a heuristic screening model. Do not describe predictions as measured properties, certified results, or safety guarantees. Keep the model limitations visible in the web app and generated protocol documents. Keep provenance and copyright text intact.

## Repository hygiene
- Do not commit generated `dist-pages/` build files or dependency directories.
- Keep CLI examples and README commands runnable from the repository root.
- Treat the published `mycelforge/` directory in `eerrgin/eerrgin.github.io` as generated output. Fix its source here, then let the publication workflow rebuild it.
- Avoid deleting old experiments or assets until references and deployment paths have been checked.
