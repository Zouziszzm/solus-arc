# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm lint         # biome check (linter)
pnpm format       # biome format --write
```

No test suite exists.

## Architecture

Solus-Arc is a Next.js component showcase site. Users browse components, preview them with live prop controls, and copy the source code into their own projects (no npm package).

### Registry system (`registry/`)

The registry is the core abstraction. Every component needs two files:

1. **`registry/components/<slug>.tsx`** — the actual React component, exported by name (PascalCase, no spaces, matching `config.name`)
2. **`registry/configs/<slug>.config.ts`** — a `ComponentConfig` object describing metadata and all configurable props

Then export the config from **`registry/index.ts`**.

The `ComponentConfig` type (`registry/types.ts`) defines the component's `slug`, `category`, `sourceFile`, and a `props` array. Each prop has a `type` (`slider`, `switch`, `input`, `number`, `select`, `color`, `links`) which drives the live controls UI in the workbench.

### Workbench (`src/components/workbench/`)

The component detail page (`src/app/components/[slug]/page.tsx`) is a server component that:
- Looks up the config by slug from the registry
- Dynamically imports the component by name from `registry/components`
- Reads the raw source file from disk to display as copyable code
- Passes everything to `WorkbenchClient`

`WorkbenchClient` manages live prop state (initialized from config defaults) and renders the preview, controls, info, and props panels.

### Key conventions

- `cn()` from `src/lib/utils.ts` for Tailwind class merging
- Fonts: `font-sans` (Inter), `font-serif` (Instrument Serif), `font-lora` (Lora) via CSS variables
- Theme: `next-themes` via `Providers.tsx`; use `text-foreground`, `bg-background`, `border-border` etc.
- Animation: `motion/react-client` for client components, `motion/react-server` not used
- Linter/formatter: Biome (not ESLint/Prettier) — 2-space indent, organizes imports automatically
