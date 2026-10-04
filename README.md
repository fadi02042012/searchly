# Searchly

Searchly is a client-side smart multi-mode search interface for web, news, images, maps, and videos, with Arabic/English UI, advanced filters, smart intent detection, command palette, themes, and optional Gemini-powered query understanding.

## Development

Requirements: Node.js 20+.

```bash
npm install
npm test
npm run lint
npm run test:coverage
```

The browser app is served from `index.html` and loads `app.js` as an ES module. The optional API endpoints live in `api/` and expect `GEMINI_API_KEY` to be configured server-side.

## Architecture

- `app.js` — browser orchestration and event wiring.
- `src/search` — provider URL generation.
- `src/smart` — pure smart-query detection and rules.
- `src/filters` — filter state and persistence helpers.
- `src/commands` — command-palette helpers.
- `src/i18n` — translation helpers.
- `src/ui` — reusable rendering helpers.
- `data/smart-rules.json` — editable smart-search rules.
- `tests` — Vitest unit tests for pure logic.
- `api` — server-side Gemini endpoints; secrets never belong in frontend code.

## Deployment

The project is compatible with static hosting for the frontend. If deploying the `api/` functions with Vercel, set `GEMINI_API_KEY` as a server-side environment variable and deploy from the repository root.

## Security notes

Search URLs are generated with encoded user input and validated protocols. User-controlled text should continue to be rendered with text nodes or escaped HTML. Gemini responses are sanitized before their structured values are used by the frontend.
