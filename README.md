# Abio Web

Frontend for **Abio** — a link-in-bio / profile product. Users sign up, customize appearance (themes, fonts, corners, wallpaper), manage links, and publish a public page at `/{username}`.

This repo is a **Vite rebuild** of a legacy Next.js app. Product rules, API quirks, and migration notes live in [`CURSOR.md`](./CURSOR.md). Treat that file as the source of truth for feature parity.

---

## Tech stack

| Layer | Choice | Role |
|-------|--------|------|
| Framework | React 19 + TypeScript | UI |
| Build | Vite 8 | Dev server, bundling |
| Routing | TanStack Router | File-based routes, type-safe navigation |
| Server state | TanStack Query | API data, cache, mutations |
| Client state | Zustand | Auth session (expand for local UI state as needed) |
| HTTP | Axios | API client with Bearer token |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) | Design system and primitives |
| Forms | React Hook Form + Zod | Auth and onboarding (wired incrementally) |
| Toasts | Sonner | User feedback |
| PWA | vite-plugin-pwa (Workbox) | Installable app shell, offline-safe caching |
| Unit/component tests | Vitest + React Testing Library | Logic and component behavior |
| E2E tests | Playwright | Browser smoke tests against a built preview |

---

## Architecture approach

We follow a **feature-first** layout with thin shared layers. The goal is to avoid the problems of the old app: duplicated fetching, multiple stores for the same user, and giant page files.

Each feature under `src/features/<name>/` owns its own `api/`, `components/`, `hooks/`, `types.ts`, and (where relevant) `store/` or `lib/` — and exposes only what other features need through `index.ts`. Anything used by two or more features graduates to `src/shared/`.

### Principles

1. **TanStack Query owns server state** — settings, links, user profile, public profile. Use consistent query keys from `src/shared/lib/query-keys.ts`.
2. **Zustand for client-only state** — auth session today; optional for UI drafts (e.g. appearance before save). Do not mirror server data in Zustand unless you need instant UI with a clear sync story.
3. **Thin API modules** — `src/features/<domain>/api/*.api.ts` only call HTTP endpoints. No React in this layer.
4. **Mappers live in `src/features/appearance/lib/`** — convert API shapes (`CornerConfig`, `FontConfig`) to UI models (`ButtonStyle`, `FontStyle`) and back. Never send invalid values (e.g. `"none"` colors) to the API.
5. **Routes are thin** — `src/routes/*` wires URLs to feature pages. Business UI lives in `src/features/*`.
6. **One phone preview source** — `usePhoneDisplayProps()` (in `src/shared/hooks/`) feeds `PhoneDisplay` on dashboard and appearance. Public pages use the same display mapping from `GET /user/{username}`.
7. **Tests alongside code** — `*.test.ts(x)` next to modules; pure logic first, then components.

### Data flow (simplified)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Route     │────▶│   Feature    │────▶│   Feature   │
│ (URL only)  │     │  component   │     │  hook (RQ)  │
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌─────────────┐
                    │ shared/      │     │  feature    │
                    │ components   │     │  api/*.api  │
                    └──────────────┘     └─────────────┘
```

---

## Getting started

### Prerequisites

- Node.js 22+ (LTS recommended — matches CI)
- npm

### Setup

```bash
cp .env.example .env
# Set VITE_API_BASE_URL to your backend

npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build (generates `routeTree.gen.ts`, service worker + manifest) |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript project references |
| `npm run lint` | ESLint |
| `npm test` | Run unit/component tests once |
| `npm run test:watch` | Unit/component tests in watch mode |
| `npm run test:e2e` | Playwright e2e tests against a production preview build |

### Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (replaces legacy `NEXT_PUBLIC_API_BASE_URL`) |

Auth token is stored in `localStorage` as `auth_token`; user snapshot as `user_data`. The Axios client in `src/shared/lib/api-client.ts` attaches the Bearer header automatically and strips `Content-Type` for `FormData` uploads.

---

## Folder structure

```
src/
├── app/                       # App shell (not feature UI)
│   ├── main.tsx               # Entry point, mounts root
│   ├── providers.tsx          # QueryClient, auth hydration, Sonner
│   └── router.tsx             # TanStack Router instance
│
├── routes/                    # File-based routes (URL → page)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── $username.tsx
│   ├── auth/
│   └── dashboard/
│
├── features/                  # Product areas — main place for screens
│   ├── auth/
│   │   ├── api/                # auth.api.ts
│   │   ├── components/         # SignInPage, SignUpPage
│   │   ├── hooks/               # use-auth.ts (useQuery/useMutation)
│   │   ├── store/               # auth-store.ts, auth-storage.ts (Zustand)
│   │   ├── types.ts
│   │   └── index.ts             # public exports only
│   ├── appearance/
│   │   ├── api/                 # appearance.api.ts
│   │   ├── components/          # AppearancePage, ButtonAndFontTabs, …
│   │   ├── hooks/                # use-appearance.ts, use-settings.ts
│   │   ├── lib/                  # API ↔ UI mappers (colors, corners, font, wallpaper)
│   │   ├── types.ts
│   │   └── index.ts
│   ├── dashboard/
│   ├── links/
│   ├── profile/
│   └── public-profile/
│
├── shared/                    # Cross-feature building blocks only
│   ├── components/
│   │   ├── ui/                  # shadcn primitives (Button, Input, Dialog, …)
│   │   ├── layout/               # AuthGuard, route-level wrappers
│   │   ├── PhoneDisplay.tsx      # used by dashboard + appearance + public-profile
│   │   └── PlatformIcon.tsx
│   ├── hooks/
│   │   └── usePhoneDisplayProps.ts
│   ├── lib/
│   │   ├── api-client.ts         # axios instance + interceptors
│   │   ├── query-client.ts
│   │   ├── query-keys.ts
│   │   ├── env.ts
│   │   └── utils.ts              # cn() for class names
│   └── types.ts                  # ApiResponse<T> envelope
│
├── styles/
│   └── globals.css              # Tailwind + theme tokens
│
├── assets/                     # Static imports (images, etc.)
├── test/                       # Vitest setup & render helpers
└── routeTree.gen.ts            # Generated by TanStack Router — do not edit

e2e/                            # Playwright specs (separate from unit tests)
```

### Where to put new code

| You are building… | Put it in… |
|-------------------|------------|
| A new page / URL | `src/routes/…` + `src/features/<area>/components/` |
| Reusable button, dialog, form field | `src/shared/components/ui/` (prefer shadcn CLI) |
| Widget used by 2+ features (e.g. PhoneDisplay) | `src/shared/components/` |
| API call | `src/features/<domain>/api/<domain>.api.ts` |
| `useQuery` / `useMutation` | `src/features/<domain>/hooks/` |
| API ↔ UI transformation | `src/features/<domain>/lib/` |
| Global client state | `src/features/auth/store/` (Zustand) |
| Feature-scoped types | `src/features/<domain>/types.ts` |
| Cross-feature types (e.g. `ApiResponse`) | `src/shared/types.ts` |

### Path alias

Imports use `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

```ts
import { Button } from '@/shared/components/ui/button'
import { useGetSettings } from '@/features/appearance'
```

Within a feature, prefer relative imports for files inside the same feature and `@/features/<name>` (or the feature's `index.ts` barrel) when reaching in from elsewhere.

---

## Progressive Web App

The app is installable and ships an app-shell service worker via [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (configured in `vite.config.ts`).

- **Manifest**: name, icons, theme/background color — generated from the `manifest` option; icons live in `public/` (`pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`, `apple-touch-icon.png`). Replace these placeholders with real brand assets before shipping.
- **Caching strategy — installable + safe**: only the built app shell (JS/CSS/HTML/static assets) is precached. There is **no runtime caching for API calls** — the backend lives on a separate origin (`VITE_API_BASE_URL`), so the service worker never intercepts those requests. Auth, dashboard, and appearance data always come straight from the network and can't go stale from a cache.
- **Updates**: `registerType: 'autoUpdate'` — a new service worker activates and takes over automatically on the next load; no "reload to update" prompt is currently wired up.
- **Local testing**: `devOptions.enabled` is `false`, so the SW only runs against a production build. Test with:

  ```bash
  npm run build
  npm run preview
  ```

  then check Application → Service Workers / Manifest in DevTools, or run a Lighthouse PWA audit.

If you need offline access to real app data later (e.g. viewing a cached dashboard), that's a deliberate escalation — add explicit `runtimeCaching` rules with a strategy that can't serve stale auth state (e.g. `NetworkFirst` with a short `networkTimeoutSeconds`, never `CacheFirst` for anything user-specific).

---

## Routing

Routing uses **TanStack Router** with file-based routes under `src/routes/`. The plugin generates `src/routeTree.gen.ts` on build/dev — **do not edit that file**.

### Route map

| URL | Route file | Feature page | Notes |
|-----|------------|--------------|-------|
| `/` | `routes/index.tsx` | Marketing / home | Public |
| `/auth/sign-in` | `routes/auth/sign-in.tsx` | `SignInPage` | Public |
| `/auth/sign-up` | `routes/auth/sign-up.tsx` | `SignUpPage` | Public |
| `/dashboard` | `routes/dashboard/route.tsx` + `index.tsx` | `DashboardLayout` + `DashboardPage` | Requires auth |
| `/dashboard/appearance` | `routes/dashboard/appearance.tsx` | `AppearancePage` | Requires auth |
| `/:username` | `routes/$username.tsx` | `PublicProfilePage` | Public profile |

### Adding a route

1. Create a file under `src/routes/` following [TanStack Router file naming](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing).
2. Export `Route` via `createFileRoute('/your-path')({ component: YourPage })`.
3. Implement UI in `src/features/<area>/components/`.
4. Run `npm run dev` or `npm run build` so `routeTree.gen.ts` updates.

### Navigation

Use typed links and redirects from TanStack Router:

```tsx
import { Link, Navigate } from '@tanstack/react-router'

<Link to="/dashboard/appearance">Appearance</Link>
```

### Protected routes

`/dashboard/*` checks `useIsAuthenticated()` from the auth store in `routes/dashboard/route.tsx` and redirects to `/auth/sign-in` when logged out. Reuse `AuthGuard` (`src/shared/components/layout/AuthGuard.tsx`) for nested layouts if you add more protected sections.

---

## Assets

Carried over from the legacy app (`A/`), curated rather than copied wholesale — only what the old code actually referenced.

- **Fonts** — `src/assets/fonts/` (Satoshi × 4 weights, Monument Extended × 2 weights), declared via `@font-face` in `src/styles/fonts.css` and exposed as Tailwind tokens (`font-satoshi`, `font-display`). Geist Variable remains the default `font-sans` for UI; these two are opt-in for marketing/landing treatments, mirroring the old app's `.trial` / `.trialheader` classes.
- **Public assets** (`public/`) — referenced by raw URL string, so they can't live in `src/assets` (Vite wouldn't bundle/hash them correctly for that usage):
  - `themes/` — the 4 wallpaper backgrounds actually referenced in code (`theme1`, `theme5`, `theme7`, `ootn`). The old app had `theme2`–`theme4`/`theme6` sitting unused; theme presets are API-driven now (see `ThemeSelector`), so those were dead weight.
  - `assets/platform-icons/{black,colored}/` — only the ~48 platforms in `src/shared/lib/platform-icons.ts`, not the old export's full ~140-platform icon set. That file also fixes two asset bugs found during the transfer: the old lookup key for Slack's colored icon had a space the actual filename didn't have (would have 404'd), and LinkedIn's colored variant doesn't exist in the source at all (`colored: null` — needs a new export whenever that's needed).
  - `assets/icons/{dashboard,auth}/` — nav and auth-flow icons, copied as-is.
  - `icons/`, `images/` — curated subset of what's actually referenced (product/store mockups, avatars, corner-style previews, etc.). A handful of code references pointed at files that don't exist in the old repo at all (`bell.svg`, `notification.svg`, `qr.svg`, `A logo1.svg`, `behance.svg`, `twitch.svg` under `/icons/`) — pre-existing broken links, not carried over since there was nothing to carry.
- **Not carried over**: Next.js boilerplate SVGs (`next.svg`, `vercel.svg`, etc. — never referenced), and the ~90 unused platform icons per style variant.
- **Note**: `public/images/` includes named testimonial photos (`fabulous.jpeg`, `zion.jpeg`, `samuel zeus.jpeg`) used on the old marketing landing page — carried over as-is since they're referenced in code, flagging here since they're real people's photos rather than generic stock art.

The PWA service worker (see below) deliberately does **not** precache any of `public/` beyond the app shell — this asset library is large enough that blanket-precaching it would bloat the install payload for content most sessions never touch.

---

## Styling guide

### Stack

- **Tailwind CSS v4** — utility classes in JSX
- **shadcn/ui** (style: `base-nova`) — accessible components in `src/shared/components/ui/`
- **CSS variables** — theme colors in `src/styles/globals.css` (`--background`, `--primary`, `--muted-foreground`, etc.)
- **Geist Variable** — default sans font via `@fontsource-variable/geist`

### Rules for developers

1. **Prefer shadcn components for interactive UI**
   Use `Button`, `Input`, `Field`, `Dialog`, `Sheet`, etc. from `@/shared/components/ui`. Add new primitives with:

   ```bash
   npx shadcn add <component-name>
   ```

   Aliases are in `components.json` (outputs go to `src/shared/components/ui/`).

2. **Use semantic theme tokens, not random hex in features**
   Prefer classes that map to design tokens:

   ```tsx
   // Good
   <p className="text-muted-foreground">Helper text</p>
   <div className="bg-background border-border" />

   // Avoid in feature code (unless mapping to user-chosen colors)
   <p className="text-[#6b7280]">...</p>
   ```

   User-controlled colors (appearance preview, link buttons) are an exception — they come from API/mappers as inline `style` or dynamic values.

3. **Merge classes with `cn()`**
   From `@/shared/lib/utils` — combines `clsx` + `tailwind-merge` so overrides work:

   ```tsx
   import { cn } from '@/shared/lib/utils'

   <Button className={cn('w-full', isLoading && 'opacity-50')} />
   ```

4. **Do not add one-off CSS files per feature**
   Use Tailwind in components. Global styles belong in `src/styles/globals.css` only for tokens, base layer, and rare resets.

5. **Icons**
   - **Lucide** — general UI (`lucide-react`), default for shadcn
   - **react-icons/fa6** — platform icons in `PlatformIcon.tsx`

6. **Dark mode**
   Theme variables for `.dark` are defined in `globals.css`. Enable dark mode by adding the `dark` class on a parent (e.g. `<html class="dark">`) when product requires it.

7. **Do not edit generated shadcn files heavily**
   If you need a variant, extend via `className` or wrap in a thin app-specific component in `src/shared/components/`.

### Forms

Use the **Field** pattern from shadcn:

```tsx
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'

<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" type="email" />
  </Field>
</FieldGroup>
```

Wire validation with React Hook Form + Zod on auth and onboarding flows.

---

## State management

### Server state (TanStack Query)

| Query key | Data |
|-----------|------|
| `['settings']` | Appearance preferences |
| `['links']` | User links |
| `['user']` | Current user |
| `['user-profile', username]` | Public profile |

Hooks live in each feature's `hooks/` folder (e.g. `src/features/appearance/hooks/`). After mutations, invalidate the relevant keys (see `CURSOR.md` for appearance save rules).

### Client state (Zustand)

Auth store: `src/features/auth/store/auth-store.ts`

```ts
import { useAuthUser, useIsAuthenticated, useAuthActions } from '@/features/auth'

const user = useAuthUser()
const isAuthenticated = useIsAuthenticated()
const { setUser, signOut } = useAuthActions()
```

Use **selectors** (`useAuthUser`, not the whole store) to limit re-renders.

---

## API layer

- **Client:** `src/shared/lib/api-client.ts` — base URL from env, Bearer token, FormData handling
- **Modules:** one `<domain>.api.ts` per feature — `features/auth/api/auth.api.ts`, `features/appearance/api/appearance.api.ts`, `features/links/api/links.api.ts`, `features/profile/api/profile.api.ts`
- **Types:** `src/features/<domain>/types.ts` for domain shapes; `src/shared/types.ts` for the shared `ApiResponse<T>` envelope

Appearance has non-obvious rules (image wallpaper requires FormData `type` + `image`, font names must be API-safe, etc.). Read `CURSOR.md` before changing save flows.

---

## Testing

### Unit & component tests (Vitest)

Config is in `vite.config.ts`; setup in `src/test/setup.ts`.

```bash
npm run test:watch   # while developing
npm test             # CI / pre-push
```

| Test type | Example location | When to use |
|-----------|------------------|-------------|
| Pure functions | `src/features/appearance/lib/colors.test.ts` | Mappers, validators |
| Store | `src/features/auth/store/auth-store.test.ts` | Zustand logic |
| Components | `src/shared/components/ui/button.test.tsx` | UI behavior |

For components that need Query, use `renderWithProviders` from `src/test/test-utils.tsx`.

**Convention:** name files `*.test.ts` or `*.test.tsx` next to the module under test.

### End-to-end tests (Playwright)

Config is in `playwright.config.ts`; specs live under `e2e/`, separate from unit tests. The suite builds and serves a production preview (`npm run preview`) and drives it with a real browser.

```bash
npx playwright install --with-deps chromium   # first time only
npm run test:e2e
```

Keep e2e specs to a handful of critical, cross-cutting flows (auth, dashboard load, public profile render) — push detailed logic testing down to unit/component tests.

---

## CI

`.github/workflows/ci.yml` runs on every PR and push to `main`: `lint`, `typecheck`, and `test` run in parallel, `build` runs after they pass and uploads the `dist/` artifact, and `e2e` runs after `build` using a fresh production build. Playwright's HTML report is uploaded as an artifact on failure.

---

## Key product concepts

- **PhoneDisplay** — shared preview component; props: `buttonStyle`, `fontStyle`, `selectedTheme`, `profile`, `links`
- **Appearance save** — single "Save Changes" on appearance; parallel PUTs with abort on failure (see `useUpdateAppearanceAll` stub)
- **Public profile** — special cases for usernames `ootn` and `dnabygaza` (do not remove without product sign-off)

---

## Related docs

- [`CURSOR.md`](./CURSOR.md) — migration spec, API shapes, appearance system, testing checklist
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [Playwright](https://playwright.dev)

---

## Contributing checklist

- [ ] Feature code in `src/features/<name>/`, not in route files
- [ ] API calls only in `src/features/<name>/api/`; React Query hooks in `src/features/<name>/hooks/`
- [ ] Cross-feature code promoted to `src/shared/`, not duplicated
- [ ] Styling via shadcn + Tailwind tokens; `cn()` for class merging
- [ ] Types updated in the feature's `types.ts` (or `src/shared/types.ts` for shared shapes) when API shapes change
- [ ] Tests for non-trivial logic; a Playwright spec added/updated for new critical flows
- [ ] `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` all pass
- [ ] Consult `CURSOR.md` for parity with legacy behavior
