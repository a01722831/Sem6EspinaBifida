# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js Version

This project uses **Next.js 16.2.3** (React 19). Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. APIs, conventions, and file structure may differ from training data.

## Commands

All commands run from `appespinabifida/`:

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Environment Variables

Required in `.env.local`:

```env
NEXTAUTH_SECRET=...        # Generate with: npx auth secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DB_USER=...                # Oracle REST API basic auth
DB_PASSWORD=...            # Oracle REST API basic auth
```

Google OAuth redirect URI: `http://localhost:3000/api/auth/callback/google`

## Architecture

Medical association management system (Asociación Espina Bífida) built with Next.js App Router.

**Path alias:** `@/*` maps to `./app/*`

### Authentication

NextAuth 4 (`app/lib/auth-options.ts`) with two providers:
- **Google OAuth**: auto-creates DB user on first sign-in via `createUser()` in `app/lib/db/user.ts`
- **Credentials**: email + password verified via bcryptjs against DB hash

JWT callbacks (`jwt` → `session`) inject `id` and `role` from the DB into every session token. `middleware.ts` uses `withAuth` to protect `/dashboard`, `/asociados`, `/servicios`, and `/inventory`. Server components use `getServerSession(authOptions)`; client components use `getSession()` from `next-auth/react`.

### Database Layer

Oracle Cloud database exposed via Oracle REST Data Services (ORDS). Base URL:
```
https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/
```

All requests use Basic Auth with `DB_USER`/`DB_PASSWORD`. There is no ORM — every query is a `fetch()` to an ORDS REST endpoint. Helpers live in:
- `app/lib/db/user.ts` — `getUserByEmail`, `createUser`
- `app/lib/api/inventory.ts` — inventory CRUD (partially wired to DB, partially mock)
- `app/lib/api/movements.ts` — inventory movements (currently mock data)

### API Routes (`app/api/`)

Each route calls ORDS and transforms the response before returning to the client. Oracle returns nested JSON (arrays stored as JSON strings for `telefonos`, `padecimientos`; flat fields for `padre`/`madre` objects); the API routes parse and reshape this.

| Route | Purpose |
|---|---|
| `asociados/lista_asociados` | Fetch all associates; flattens Oracle JSON, formats dates, formats addresses |
| `asociados/obtener_asociado` | Single associate by ID |
| `asociados/agregar` | Create associate |
| `asociados/editar` | Update associate |
| `asociados/fotoAsociado` | Associate photo |
| `servicios/obtener` | Combined list of consultations + studies (`tipo_servicio` distinguishes them) |
| `servicios/agregar` | Create consultation (`tipo=0`) or study (`tipo=1`) via `tipo` body field |
| `servicios/editar` | Update consultation or study |
| `servicios/remover` | Delete service |
| `medicos/` | Doctors list |
| `inventario/obtener` | Inventory items (wired to DB) |
| `login/route.ts` | Credentials validation: `POST { user, password }` |
| `auth/[...nextauth]/route.ts` | NextAuth handler |

### Pages

| Route | Description |
|---|---|
| `/` | Login page |
| `/dashboard` | Protected landing; shows session info |
| `/asociados` | Associate list and management |
| `/servicios` | Consultations + studies list; detail routes at `/servicios/[id]/detalle-consulta` and `/detalle-estudio` |
| `/inventory` | Inventory management |
| `/inventory/movimientos` | Inventory movement history |
| `/recibos` | Receipts (client-side session check) |

### Frontend Patterns

- **Client components** (`"use client"`) manage state with `useState`/`useEffect`; modals for create/edit operations. Feature-level hooks (e.g., `useServicios()`, `useDebouncedValue()`) are defined inline in the page file rather than in a separate hooks file.
- **UI primitives** in `app/components/ui/` (Button, Input, Select, Modal, Badge, Textarea) — always use these first. `app/lib/utils/cn.ts` exports a `cn()` helper (clsx + tailwind-merge) for conditional class names.
- **Icons**: lucide-react.
- **PDF generation**: jspdf — see `ImprimirCredencialButton.tsx` and `ImprimirOrdenButton.tsx`.
- **Styling**: Tailwind CSS v4 with custom CSS vars for the color theme (navy/steel palette defined in `globals.css`).
- **Inventory layer** (`app/lib/api/inventory.ts`): cursor-based pagination helper wrapping a mock in-memory store that hydrates from `/api/inventario/obtener`. Replace internals with real fetches when the DB endpoints are ready — the interface is stable.
