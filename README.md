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
| Tests | Vitest + React Testing Library | Unit and component tests |

---

## Architecture approach

We follow a **feature-first** layout with thin shared layers. The goal is to avoid the problems of the old app: duplicated fetching, multiple stores for the same user, and giant page files.

### Principles

1. **TanStack Query owns server state** — settings, links, user profile, public profile. Use consistent query keys from `src/lib/constants/query-keys.ts`.
2. **Zustand for client-only state** — auth session today; optional for UI drafts (e.g. appearance before save). Do not mirror server data in Zustand unless you need instant UI with a clear sync story.
3. **Thin API modules** — `src/api/*.api.ts` only call HTTP endpoints. No React in this layer.
4. **Mappers live in `src/lib/appearance/`** — convert API shapes (`CornerConfig`, `FontConfig`) to UI models (`ButtonStyle`, `FontStyle`) and back. Never send invalid values (e.g. `"none"` colors) to the API.
5. **Routes are thin** — `src/routes/*` wires URLs to feature pages. Business UI lives in `src/features/*`.
6. **One phone preview source** — `usePhoneDisplayProps()` feeds `PhoneDisplay` on dashboard and appearance. Public pages use the same display mapping from `GET /user/{username}`.
7. **Tests alongside code** — `*.test.ts(x)` next to modules; pure logic first, then components.

### Data flow (simplified)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Route     │────▶│   Feature    │────▶│ hooks/api   │
│ (URL only)  │     │   (UI)       │     │ (useQuery)  │
└─────────────┘     └──────┬───────┘     └──────┬──────┘
                           │                    │
                           ▼                    ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  components  │     │  api/*.api  │
                    │  PhoneDisplay│     │  + axios    │
                    └──────────────┘     └─────────────┘
```

---

## Getting started

### Prerequisites

- Node.js 20+ (LTS recommended)
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
| `npm run build` | Production build (generates `routeTree.gen.ts`) |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript project references |
| `npm run lint` | ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Tests in watch mode |

### Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (replaces legacy `NEXT_PUBLIC_API_BASE_URL`) |

Auth token is stored in `localStorage` as `auth_token`; user snapshot as `user_data`. The Axios client in `src/api/client.ts` attaches the Bearer header automatically and strips `Content-Type` for `FormData` uploads.

---

## Folder structure

```
src/
├── app/                    # App shell (not feature UI)
│   ├── providers.tsx       # QueryClient, auth hydration, Sonner
│   └── router.tsx          # TanStack Router instance
│
├── routes/                 # File-based routes (URL → page)
│   ├── __root.tsx
│   ├── index.tsx
│   ├── $username.tsx
│   ├── auth/
│   └── dashboard/
│
├── features/               # Product areas (main place for screens)
│   ├── auth/
│   ├── dashboard/
│   ├── appearance/
│   ├── profile/
│   └── public-profile/
│
├── components/             # Shared, cross-feature UI
│   ├── ui/                 # shadcn primitives (Button, Input, Dialog, …)
│   ├── PhoneDisplay.tsx
│   ├── PlatformIcon.tsx
│   └── AuthGuard.tsx
│
├── hooks/
│   ├── api/                # useQuery / useMutation wrappers
│   └── usePhoneDisplayProps.ts
│
├── api/                    # Axios + endpoint functions
├── types/                  # TypeScript domain & API types
├── lib/
│   ├── appearance/         # API ↔ UI mappers
│   ├── constants/          # query-keys, etc.
│   ├── query-client.ts
│   └── utils.ts            # cn() for class names
│
├── store/                  # Zustand + localStorage helpers
├── config/                 # env helpers
├── test/                   # Vitest setup & render helpers
└── index.css               # Tailwind + theme tokens
```

### Where to put new code

| You are building… | Put it in… |
|-------------------|------------|
| A new page / URL | `src/routes/…` + `src/features/…` |
| Reusable button, dialog, form field | `src/components/ui/` (prefer shadcn CLI) |
| Shared widget used by 2+ features | `src/components/` |
| API call | `src/api/<domain>.api.ts` |
| `useQuery` / `useMutation` | `src/hooks/api/` |
| API ↔ UI transformation | `src/lib/<domain>/` |
| Global client state | `src/store/` (Zustand) |
| Types | `src/types/` |

### Path alias

Imports use `@/` → `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

```ts
import { Button } from '@/components/ui/button'
import { useGetSettings } from '@/hooks/api'
```

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
3. Implement UI in `src/features/<area>/`.
4. Run `npm run dev` or `npm run build` so `routeTree.gen.ts` updates.

### Navigation

Use typed links and redirects from TanStack Router:

```tsx
import { Link, Navigate } from '@tanstack/react-router'

<Link to="/dashboard/appearance">Appearance</Link>
```

### Protected routes

`/dashboard/*` checks `useIsAuthenticated()` from the auth store in `routes/dashboard/route.tsx` and redirects to `/auth/sign-in` when logged out. Reuse `AuthGuard` for nested layouts if you add more protected sections.

---

## Styling guide

### Stack

- **Tailwind CSS v4** — utility classes in JSX
- **shadcn/ui** (style: `base-nova`) — accessible components in `src/components/ui/`
- **CSS variables** — theme colors in `src/index.css` (`--background`, `--primary`, `--muted-foreground`, etc.)
- **Geist Variable** — default sans font via `@fontsource-variable/geist`

### Rules for developers

1. **Prefer shadcn components for interactive UI**  
   Use `Button`, `Input`, `Field`, `Dialog`, `Sheet`, etc. from `@/components/ui`. Add new primitives with:

   ```bash
   npx shadcn add <component-name>
   ```

   Aliases are in `components.json` (outputs go to `src/components/ui/`).

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
   From `@/lib/utils` — combines `clsx` + `tailwind-merge` so overrides work:

   ```tsx
   import { cn } from '@/lib/utils'

   <Button className={cn('w-full', isLoading && 'opacity-50')} />
   ```

4. **Do not add one-off CSS files per feature**  
   Use Tailwind in components. Global styles belong in `src/index.css` only for tokens, base layer, and rare resets.

5. **Icons**  
   - **Lucide** — general UI (`lucide-react`), default for shadcn  
   - **react-icons/fa6** — platform icons in `PlatformIcon.tsx`

6. **Dark mode**  
   Theme variables for `.dark` are defined in `index.css`. Enable dark mode by adding the `dark` class on a parent (e.g. `<html class="dark">`) when product requires it.

7. **Do not edit generated shadcn files heavily**  
   If you need a variant, extend via `className` or wrap in a thin app-specific component in `src/components/`.

### Forms

Use the **Field** pattern from shadcn:

```tsx
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

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

Hooks live in `src/hooks/api/`. After mutations, invalidate the relevant keys (see `CURSOR.md` for appearance save rules).

### Client state (Zustand)

Auth store: `src/store/auth-store.ts`

```ts
import { useAuthUser, useIsAuthenticated, useAuthActions } from '@/store'

const user = useAuthUser()
const isAuthenticated = useIsAuthenticated()
const { setUser, signOut } = useAuthActions()
```

Use **selectors** (`useAuthUser`, not the whole store) to limit re-renders.

---

## API layer

- **Client:** `src/api/client.ts` — base URL from env, Bearer token, FormData handling  
- **Modules:** `auth.api.ts`, `appearance.api.ts`, `links.api.ts`, `profile.api.ts`  
- **Types:** `src/types/` — keep request/response shapes here  

Appearance has non-obvious rules (image wallpaper requires FormData `type` + `image`, font names must be API-safe, etc.). Read `CURSOR.md` before changing save flows.

---

## Testing

Tests use **Vitest** + **Testing Library**. Config is in `vite.config.ts`; setup in `src/test/setup.ts`.

```bash
npm run test:watch   # while developing
npm test             # CI / pre-push
```

| Test type | Example location | When to use |
|-----------|------------------|-------------|
| Pure functions | `src/lib/appearance/colors.test.ts` | Mappers, validators |
| Store | `src/store/auth-store.test.ts` | Zustand logic |
| Components | `src/components/ui/button.test.tsx` | UI behavior |

For components that need Query, use `renderWithProviders` from `src/test/test-utils.tsx`.

**Convention:** name files `*.test.ts` or `*.test.tsx` next to the module under test.

---

## Key product concepts

- **PhoneDisplay** — shared preview component; props: `buttonStyle`, `fontStyle`, `selectedTheme`, `profile`, `links`
- **Appearance save** — single “Save Changes” on appearance; parallel PUTs with abort on failure (see `useUpdateAppearanceAll` stub)
- **Public profile** — special cases for usernames `ootn` and `dnabygaza` (do not remove without product sign-off)

---

## Related docs

- [`CURSOR.md`](./CURSOR.md) — migration spec, API shapes, appearance system, testing checklist  
- [TanStack Router](https://tanstack.com/router)  
- [TanStack Query](https://tanstack.com/query)  
- [shadcn/ui](https://ui.shadcn.com)  
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## Contributing checklist

- [ ] Feature code in `src/features/`, not in route files  
- [ ] API calls only in `src/api/`; React Query hooks in `src/hooks/api/`  
- [ ] Styling via shadcn + Tailwind tokens; `cn()` for class merging  
- [ ] Types updated in `src/types/` when API shapes change  
- [ ] Tests for non-trivial logic  
- [ ] `npm run typecheck` and `npm test` pass  
- [ ] Consult `CURSOR.md` for parity with legacy behavior  
