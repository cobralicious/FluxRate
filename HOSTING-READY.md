# FluxRate hosting readiness

## 1. Architecture

FluxRate is a Cloudflare-compatible full-stack app with:
- Next.js / Vinext frontend
- React 19 + TypeScript
- Worker-compatible server routes
- Cloudflare Vite plugin and Wrangler integration
- external data providers: Frankfurter, NBP, Coinbase, CoinGecko
- public UI plus server-side API route at `/api/market`

It is not a static GitHub Pages site. The app requires a runtime that supports server routes and environment variables. Cloudflare Workers or a Cloudflare-compatible hosting target is the expected deployment model.

## 2. Required Node/pnpm versions

- Node.js: 22.13 or newer
- pnpm: 11.25.0 (as declared in package.json)

## 3. Required environment variables

Create a local `.env` file from `.env.example` and fill in the values needed for your environment.

```env
COINGECKO_DEMO_API_KEY=
```

Notes:
- `COINGECKO_DEMO_API_KEY` is server-side only.
- It must not be exposed to the browser.
- It must not be named `NEXT_PUBLIC_*`.
- It is used by the market API route and provider adapters.

Optional values may be added later for deployment-specific configuration, but they must remain server-only unless explicitly public.

## 4. Local setup

```bash
git clone <repo-url>
cd FluxRate
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

## 5. Tests

Run:

```bash
pnpm test
pnpm typecheck
pnpm lint
```

## 6. Production build

```bash
pnpm build
```

This is the production build step used for Cloudflare-compatible deployment.

## 7. GitHub preparation

Commit and push the following:
- source code
- package.json and pnpm-lock.yaml
- tests and configuration
- docs and asset tree
- `.env.example`

Do not commit:
- `.env`, `.env.local`, `.env.production`
- `.next`, `.vinext`, `.wrangler`, `.sites-runtime`
- `node_modules`
- logs, local cache files, temporary directories, editor metadata
- any actual secret values

## 8. Cloudflare deployment

1. Create or sign in to a Cloudflare account.
2. Open Cloudflare dashboard and create a new project or worker-based deployment.
3. Connect the GitHub repository.
4. Set the root directory to the repository root.
5. Use:
   - Install command: `pnpm install --frozen-lockfile`
   - Build command: `pnpm build`
   - Node version: `22`
6. Add the environment secret:
   - `COINGECKO_DEMO_API_KEY`
7. Deploy.

If your Cloudflare target uses a custom deploy entrypoint, ensure it points to the generated Worker-compatible build output and not a static-only folder.

## 9. Post-deploy verification

After deployment, verify the public URL with:

```bash
pnpm verify:live -- https://PUBLIC_URL
```

This script checks:
- live API responses
- stale or broken fiats
- provider failures
- crypto failure states
- invalid chart data
- missing CoinGecko config
- HTTP and JSON errors

## 10. Known limitations

- CoinGecko requires a valid server-side Demo API key for the CoinGecko features to work.
- External provider availability varies by host and network conditions.
- Live external API verification depends on the actual deployment environment and provider access.
- This repo is production-oriented but still depends on real upstream data quality, not mocked values.

## Checklist

- [ ] pnpm install --frozen-lockfile
- [ ] pnpm typecheck
- [ ] pnpm lint
- [ ] pnpm test
- [ ] pnpm build
- [ ] secrets configured
- [ ] deployed
- [ ] verify:live passed
- [ ] mobile checked
- [ ] desktop checked
- [ ] fiat checked
- [ ] crypto checked
