# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@devtron-labs/devtron-fe-common-lib` is a React component and utility library for the Devtron platform. It is built with Vite and published to npm as an ES module.

## Commands

```bash
# Type-check + lint (strict, max-warnings=0)
npm run lint

# Auto-fix lint issues
npm run lint-fix

# Build with source maps (development/local linking)
npm run build

# Watch mode rebuild with source maps
npm run build-watch

# Build without source maps (CI/CD, publishing)
npm run build-lib

# Vite dev server
npm run dev

# Generate icon/illustration components from SVGs
npm run generate-icon
npm run generate-illustration
```

There are no tests currently (`npm test` is a no-op).

## Architecture

### Entry & Exports

`src/index.ts` re-exports everything from four top-level modules:

- **`src/Common/`** — Legacy utilities, hooks, and components (BreadCrumb, SearchBar, Checkbox, etc.)
- **`src/Shared/`** — Primary reusable code: 100+ UI components, hooks, providers, services, API utilities, types, helpers, constants, validations
- **`src/Pages/`** — Full-page components (Applications, BulkEdit, GlobalConfigurations, ResourceBrowser)
- **`src/Pages-Devtron-2.0/`** — New Devtron 2.0 features (ApplicationManagement, Navigation, SecurityCenter, etc.)

### Component Structure Convention

Components follow a consistent directory layout:

```
ComponentName/
├── ComponentName.component.tsx   # Main component (forwardRef + React.memo typical)
├── types.ts                      # TypeScript interfaces/types
├── constants.ts                  # Component-level constants
├── utils.ts                      # Helper functions
├── component.scss                # Scoped SCSS styles
└── index.ts                      # Barrel export
```

### Key Architectural Patterns

**State management**: React Context API only — `MainContextProvider`, `ThemeProvider`, `UserEmailProvider`. No Redux/Zustand.

**API layer**: TanStack Query (React Query v4) via `CoreAPI` class. API queuing handled via `APIQueuing`. Custom query hooks live in `Shared/API/reactQueryHooks.ts`.

**Styling**: SCSS with BEM naming. CSS is injected into JS chunks via `vite-plugin-lib-inject-css`. No CSS modules.

**SVG icons**: Imported as React components via `vite-plugin-svgr`. Two icon generations: `src/Assets/Icon/` and `src/Assets/IconV2/`. Do **not** use `IconBase` or `IllustrationBase` directly — use the `Icon` and `Illustration` wrapper components.

**Toasts**: Do **not** import from `react-toastify` directly — use `ToastManager` from the library.

**Forms**: Dynamic forms use `@rjsf` (React JSON Schema Form). Custom form hooks in `Shared/Hooks/`.

**Router**: React Router v6 (`useBlocker` etc.). The `usePrompt` hook handles navigation blocking.

### TypeScript & Path Aliases

`tsconfig.json` configures path aliases used throughout the codebase:

| Alias                | Maps to                   |
| -------------------- | ------------------------- |
| `@Icons/*`           | `src/Assets/Icon/*`       |
| `@IconsV2/*`         | `src/Assets/IconV2/*`     |
| `@Common/*`          | `src/Common/*`            |
| `@Shared/*`          | `src/Shared/*`            |
| `@Pages/*`           | `src/Pages/*`             |
| `@PagesDevtron2.0/*` | `src/Pages-Devtron-2.0/*` |

Strict mode is **off** in tsconfig. Target is ES2020, module is ESNext.

### Build Output

Vite splits the bundle into named chunks: `@vendor`, `@code-editor`, `@framer-motion`, `@moment`, `@react-select`, `@react-virtualized-sticky-tree`, `@common-rjsf`, `@src-assets-*`. Output is ES modules only, landing in `dist/`. Type declarations are generated via `vite-plugin-dts` at `dist/index.d.ts`.

## Code Style

- **Prettier**: No semicolons, single quotes, 120-char print width, 4-space tabs, trailing commas everywhere.
- **ESLint**: Airbnb + TypeScript + Prettier. Import order enforced by `eslint-plugin-simple-import-sort`.
- **Pre-commit**: `lint-staged` runs ESLint on staged `.{js,jsx,ts,tsx}` files via Husky.
- JSX only in `.tsx` files (not `.jsx`).
- `no-console` is a warning (not error).

## CI/CD

- **PRs**: Node version from `.nvmrc`, `npm ci`, `npm run lint`, `npm run build-lib`.
- **Releases**: Triggered by GitHub release creation, runs `npm test` + `npm run build-lib` + `npm publish --access public` using `NPM_TOKEN` secret.
