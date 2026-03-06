# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@devtron-labs/devtron-fe-common-lib` is a React TypeScript component library for the Devtron platform, built with Vite. It provides shared UI components, utilities, and page-level modules consumed by Devtron applications.

## Commands

### Development
```bash
npm run dev              # Start development server with Vite
npm run build            # Build library with sourcemaps
npm run build-watch      # Build in watch mode for development
```

### Linting & Type Checking
```bash
npm run lint             # Run TypeScript type check and ESLint
npm run lint-fix         # Auto-fix ESLint issues
npx tsc --noEmit        # Run TypeScript type check only
```

### Asset Generation
```bash
npm run generate-icon            # Generate Icon.tsx from SVG files in IconV2/
npm run generate-illustration    # Generate Illustration.tsx from SVG files in Illustration/
```

Note: These scripts run automatically in pre-commit hooks when icon/illustration files are modified.

## Architecture

### Module Organization

The codebase is divided into four main directories under `src/`:

1. **`Common/`** - Core UI components and utilities
   - Reusable components: Checkbox, EmptyState, Progressing, SearchBar, Tooltip, etc.
   - Form components: RadioGroup, DebouncedSearch, CustomTagSelector
   - Layout components: BreadCrumb, Drawer, Modals
   - RJSF (React JSON Schema Form) customizations
   - Shared services, hooks, types, and constants

2. **`Shared/`** - Shared infrastructure
   - **Components/**: 100+ specialized components (CodeEditor, MaterialHistory, FileUpload, etc.)
   - **Providers/**: Context providers (ThemeProvider, UserEmailProvider, MainContextProvider, ImageSelectionUtility)
   - **Services/**: API services, ToastManager, and utilities
   - **Hooks/**: Custom React hooks
   - **Analytics/**: Analytics integration
   - Shared helpers, validations, constants, and types

3. **`Pages/`** - Legacy page-level components
   - Applications (CI/CD pipeline types and components)
   - BulkEdit
   - GlobalConfigurations
   - ResourceBrowser

4. **`Pages-Devtron-2.0/`** - Redesigned pages organized by business domain
   - ApplicationManagement
   - Automation&Enablement
   - CostVisibility
   - DataProtectionManagement
   - GlobalConfiguration
   - GlobalOverview
   - InfrastructureManagement
   - Navigation
   - SecurityCenter
   - Shared
   - SoftwareReleaseManagement

5. **`Assets/`** - Static assets
   - `Icon/`: SVG icons (legacy)
   - `IconV2/`: Modern SVG icons (auto-generated into Icon component)
   - `Illustration/`: SVG illustrations (auto-generated into Illustration component)
   - `Img/`: PNG/JPG images
   - `Sounds/`: Audio files

### Path Aliases

TypeScript path aliases are configured in [tsconfig.json](tsconfig.json):

```typescript
@Icons/*           → src/Assets/Icon/*
@IconsV2/*         → src/Assets/IconV2/*
@Illustrations/*   → src/Assets/Illustration/*
@Sounds/*          → src/Assets/Sounds/*
@Images/*          → src/Assets/Img/*
@Common/*          → src/Common/*
@Shared/*          → src/Shared/*
@Pages/*           → src/Pages/*
@PagesDevtron2.0/* → src/Pages-Devtron-2.0/*
```

Always use these aliases instead of relative paths when importing across directories.

### Build Configuration

The library uses Vite with manual chunk splitting for optimal bundle size ([vite.config.ts](vite.config.ts)):

- `@react-dates` - Date picker components
- `@framer-motion` - Animation library
- `@moment` - Date manipulation
- `@react-select` - Select components
- `@react-virtualized-sticky-tree` - Tree component
- `@code-editor` - CodeMirror and related code editor components
- `@common-rjsf` - React JSON Schema Form components
- `@vendor` - All other node_modules
- `@src-assets-icons` - Icon assets
- `@src-assets-images` - Image assets

When adding new large dependencies, consider adding them to the manual chunks configuration to optimize bundle loading.

## Code Standards

### Import Restrictions (Enforced by ESLint)

The following imports are **prohibited**:

1. **Toast notifications**: Never import from `react-toastify` directly
   ```typescript
   // ❌ DON'T
   import { toast } from 'react-toastify'

   // ✅ DO
   import { ToastManager } from '@Shared/Services'
   ToastManager.showToast(...)
   ```

2. **Icons**: Never use `IconBase` directly
   ```typescript
   // ❌ DON'T
   import { IconBase } from '...'

   // ✅ DO
   import { Icon } from '@Shared/Components'
   <Icon name="..." />
   ```

3. **Illustrations**: Never use `IllustrationBase` directly
   ```typescript
   // ❌ DON'T
   import { IllustrationBase } from '...'

   // ✅ DO
   import { Illustration } from '@Shared/Components'
   <Illustration name="..." />
   ```

### Import Order

ESLint enforces a specific import order (configured in [.eslintrc.cjs](.eslintrc.cjs:116-134)):

1. React and external packages (`react`, `@?\\w`)
2. Devtron packages (`@devtron-labs`)
3. Internal path aliases (`@Common/*`, `@Shared/*`, etc.)
4. Side effect imports
5. Relative imports (`../`, `./`)
6. Style imports (`.css`, `.scss`)

The `simple-import-sort` plugin will auto-fix import order on save.

### Component Patterns

- **Function components**: Use arrow functions for all components (enforced by ESLint)
  ```typescript
  // ✅ DO
  export const MyComponent = () => { ... }

  // ❌ DON'T
  export function MyComponent() { ... }
  ```

- **TypeScript**: Strict mode is disabled, but type safety is encouraged
- **React Query**: Use `@tanstack/react-query` (<5) for data fetching
  - Supports custom meta fields: `showToastError?: boolean` (defaults to `true`)

### Pre-commit Hooks

The pre-commit hook ([.husky/pre-commit](.husky/pre-commit)) enforces:

1. **Icon generation**: If IconV2/ files change, auto-generates `src/Shared/Components/Icon/Icon.tsx`
2. **Illustration generation**: If Illustration/ files change, auto-generates `src/Shared/Components/Illustration/Illustration.tsx`
3. **TypeScript check**: `tsc --noEmit` must pass
4. **Lint-staged**: ESLint check on staged files

When adding/modifying SVG assets in IconV2/ or Illustration/, the pre-commit hook will automatically regenerate the component files and add them to the commit.

## Common Tasks

### Adding a New Icon

1. Add SVG file to `src/Assets/IconV2/`
2. Stage changes: `git add src/Assets/IconV2/ic-your-icon.svg`
3. The pre-commit hook will auto-generate `Icon.tsx`
4. Use in code:
   ```typescript
   import { Icon } from '@Shared/Components'
   <Icon name="ic-your-icon" />
   ```

### Adding a New Illustration

1. Add SVG file to `src/Assets/Illustration/`
2. Stage changes: `git add src/Assets/Illustration/your-illustration.svg`
3. The pre-commit hook will auto-generate `Illustration.tsx`
4. Use in code:
   ```typescript
   import { Illustration } from '@Shared/Components'
   <Illustration name="your-illustration" />
   ```

### Working with React Query

Custom meta fields are available for queries and mutations:

```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

// Suppress error toasts for a specific query
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  meta: { showToastError: false }  // Won't show toast on error
})

// Error toasts are shown by default
useMutation({
  mutationFn: updateData,
  // meta: { showToastError: true } is default
})
```

### Extending Environment Configuration

Environment configuration types are defined in [src/index.ts](src/index.ts:21-193) as `customEnv` interface. When adding new environment variables:

1. Add type to `customEnv` interface
2. Document with JSDoc comments (especially for feature flags)
3. Include `@default` value if applicable
4. Access via `window._env_` in components

## Testing & CI

The repository has GitHub Actions workflows:

- `.github/workflows/ci.yml` - CI checks
- `.github/workflows/release-package.yml` - Package publishing

Currently, tests are stubbed (`npm test` exits 0), but the infrastructure supports `@testing-library/react` and `@testing-library/jest-dom`.

## Key Dependencies

**UI & Components:**
- React 17.0.2
- @xyflow/react (flow diagrams)
- chart.js (charts)
- react-dates (date pickers)
- react-select 5.8.0
- framer-motion (animations)

**Code Editing:**
- @uiw/react-codemirror + CodeMirror 6 extensions
- codemirror-json-schema (JSON/YAML schema validation)

**Forms:**
- @rjsf/core 5.13.3 (React JSON Schema Forms)

**Data Management:**
- @tanstack/react-query (<5)
- rxjs 7.8.1

**Utilities:**
- dayjs (date formatting)
- marked (Markdown rendering)
- dompurify (HTML sanitization)
- yaml 2.4.1
