# Contributing

## Branches

| Branch | Purpose | Lead |
|--------|---------|------|
| `main` | Production — integrated app | Tim |
| `dev` | Integration branch | Tim |
| `feat/frontend-ui` | Frontend components, maps, pages | Iswaro |
| `feat/backend-services` | API endpoints, KEFRI webhooks, Gemini | Eric |
| `feat/data-species` | Species data, KEFRI datasets, GIS regions | Collins |
| `feat/docs-quality` | Documentation, testing, education content | Lynn |

## Workflow

1. Pull your branch: `git pull origin feat/your-branch`
2. Work in your area, commit
3. Push: `git push origin feat/your-branch`
4. Open PR into `dev` for review
5. After approval, Tim merges into `dev` then `main`

## First Pull

```bash
git clone <repo-url>
git checkout feat/<your-branch>
npm install
npm run dev
```
