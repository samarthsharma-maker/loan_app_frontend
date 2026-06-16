# loan_app_frontend

React 19 + Vite + TypeScript + Tailwind single-page app for the LoanHub portal. Served by nginx in production.

Part of the LoanHub polyrepo:
[`loan_app_backend `](https://github.com/raj-pro/loan_app_backend ) ·
[`loan_app_frontend`](https://github.com/raj-pro/loan_app_frontend) ·
[`loanhub-infra`](https://github.com/raj-pro/loanhub-infra) ·
[`loanhub-gitops`](https://github.com/raj-pro/loanhub-gitops)

## Develop

```sh
npm ci
npm run dev        # Vite dev server on :3000
npm run lint       # tsc --noEmit (type-check)
npm test           # vitest
npm run build      # production bundle into dist/
```

The API base URL is injected at build time via `VITE_API_BASE_URL` (defaults to `/api`,
served same-origin through the nginx reverse proxy).

## Container

Multi-stage [`Dockerfile`](Dockerfile): Node 20 build → `nginx:alpine` serving the static bundle
and reverse-proxying `/api` to the backend ([`nginx.conf`](nginx.conf)).

```sh
docker build --build-arg VITE_API_BASE_URL=/api -t loan_app_frontend .
```

## Quality gates

- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): type-check, test, and build on Node 20.
- **Pre-commit hook**: `git config core.hooksPath .githooks` to type-check before each commit.
  (Optional upgrade: Husky + lint-staged + Prettier for formatting on staged files.)
