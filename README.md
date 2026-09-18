# FluxRate

FluxRate is a Cloudflare-compatible currency and crypto market app built with Next.js/Vinext, React, TypeScript, Tailwind and Cloudflare Worker support. It includes fiat conversion, provider-aware history, crypto quotes, charts, locale-aware formatting and server-side API routes.

## Local development

Requirements:
- Node.js 22.13+
- pnpm 11.25.0 (as declared in package.json)

Quick start:

```bash
git clone <repo-url>
cd FluxRate
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

The app expects server-side configuration in `.env` for optional external providers. The most important value is `COINGECKO_DEMO_API_KEY`, which must never be exposed to the browser.

## Production deployment

### GitHub

Commit and push the repository source, including:
- application source
- config files
- package manifest and lockfile
- docs and tests
- `.env.example`

Do not commit:
- `.env`, `.env.local`, `.env.production`
- `.next`, `.vinext`, `.wrangler`, `.sites-runtime`, `.openai`
- `node_modules`
- logs, temp files, preview state, local caches

### Cloudflare

Use GitHub as the source repository. In Cloudflare Pages or Workers-based deployment:
- Connect the GitHub repository
- Set the root directory to the project root
- Use install command: `pnpm install --frozen-lockfile`
- Use build command: `pnpm build`
- Use output directory or deploy command based on the Cloudflare target you are using
- Set Node version to `22.13` or newer
- Add `COINGECKO_DEMO_API_KEY` as a secret in Cloudflare project settings

This project is designed for Cloudflare Workers-compatible hosting, not GitHub Pages. It includes a server API route and requires a Worker runtime or equivalent Cloudflare-compatible build target.

## Environment variables

Copy `.env.example` to `.env` and fill in values locally. The key values are server-side only and must not be published as `NEXT_PUBLIC_*`.

The required setting is:

```env
COINGECKO_DEMO_API_KEY=
```

## Verification

Run the repository checks before release:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Data source notes

- Frankfurter provides fiat reference rates and historical history.
- NBP provides published fiat data and fallback snapshots.
- Coinbase provides crypto market products and candles.
- CoinGecko Demo adds catalog and market data when a server-side API key is provided.

This project intentionally distinguishes fresh, stale and reference data; no invented rates are shown.
