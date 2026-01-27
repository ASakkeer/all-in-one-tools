# Architecture Documentation

## Project Overview
All-in-one tools application built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, and React Router. Each tool is fully client-side and accessed via a simple router-based navigation.

## High-Level Architecture Overview

- **Entry & Shell**
  - `index.html` – static HTML shell with strict CSP and SEO meta.
  - `src/main.tsx` – React entry; configures Monaco workers and mounts router.
  - `src/app/router.tsx` – `createBrowserRouter` with:
    - `/` → `Home` (tool catalog)
    - `/tools/:toolId` → `Tool` (dynamic tool host)
- **State Management**
  - `src/app/store.ts` – `configureStore` with an (currently) empty `reducer` map; prepared for future slices.
  - `src/app/providers.tsx` – `Providers` wraps children in Redux `<Provider store={store}>` (not yet wired into `main.tsx` but designed as the global state injection point).
- **Pages**
  - `src/pages/Home` – marketing-style landing with tool grid.
  - `src/pages/Tool` – generic tool host that switches on `toolId` (currently only `json-formatter`) and adds SEO + page-level layout.
- **Tools**
  - `src/tools/` – each tool gets its own folder with `index.tsx`, `hooks/`, `components/`, `utils/`.
  - Current concrete implementation: `jsonFormatter` following this pattern.
- **Styling & Design System**
  - Tailwind CSS v4 (via `@import "tailwindcss"` in `src/index.css`) as the primary design system.
  - Additional app-level styles may live in `src/App.css` (currently Vite boilerplate) and can be trimmed or repurposed.

## Project Structure
```
src/
 ├─ app/
 │   ├─ store.ts          # Redux store configuration
 │   ├─ router.tsx        # React Router configuration
 │   └─ providers.tsx     # App providers wrapper (Redux, etc.)
 ├─ pages/
 │   ├─ Home/             # Home page
 │   │   └─ index.tsx
 │   └─ Tool/             # Tool page (dynamic route)
 │       └─ index.tsx
 ├─ tools/
 │   └─ jsonFormatter/    # Individual tool components
 │       └─ index.tsx
 ├─ shared/
 │   └─ components/       # Shared/reusable components
 ├─ styles/               # Additional styles (if needed)
 └─ main.tsx              # Application entry point
```

## Technology Stack
- **Framework**: React 19.2.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Code Quality**: ESLint, Prettier

### Configuration Files
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration (uses @tailwindcss/postcss for v4)
- `vite.config.ts` - Vite configuration with path aliases (@)
- `tsconfig.app.json` - TypeScript configuration with path aliases
- `src/index.css` - Tailwind CSS imports (v4 syntax: `@import "tailwindcss"`)

### Path Aliases
- `@/*` maps to `./src/*` for cleaner imports

### Routing
- `/` - Home page
- `/tools/:toolId` - Dynamic tool page

## Development Status
- ✅ Project structure created
- ✅ Routing configured
- ✅ Tailwind CSS set up
- ✅ Redux store configured
- ✅ JSON Formatter tool implemented

## Component Structure & Responsibilities

### Entry & Layout

- `main.tsx`
  - Configures Monaco via `@monaco-editor/loader` and `MonacoEnvironment.getWorkerUrl` to ensure workers respect CSP and are bundled locally.
  - Renders `<RouterProvider router={router} />` inside `React.StrictMode`.
  - **Note:** `Providers` (Redux) is defined but not yet wrapped here; when global state is introduced, `RouterProvider` should be nested inside `Providers`.
- `app/router.tsx`
  - Centralised route map using `createBrowserRouter`.
  - Keeps the surface area small and predictable for adding future tools.

### Pages

- `pages/Home/index.tsx`
  - Landing page that lists available tools in a responsive grid.
  - Uses `useNavigate` from React Router to push to `/tools/:toolId` for active tools.
  - Cards use Tailwind utility classes for a clean, card-based layout (`bg-white`, `rounded-lg`, `shadow-sm`, `border`, `hover:shadow-md`).
  - Inactive tools are visually de-emphasised via `opacity-60`, `cursor-not-allowed`, and a `Coming soon` pill.
- `pages/Tool/index.tsx`
  - Generic host for tool detail pages, currently hard-coded for `toolId === "json-formatter"`.
  - Injects `JsonLdSchema` (SoftwareApplication schema) into `<head>` for SEO.
  - Provides page-level layout: full-height background, centered container, and the **tool header** and **trust notice** above the tool UI.
  - Implements a premium-style header for JSON Formatter:
    - Back navigation (`Link` to `/`) at top-left.
    - Card-like header section with eyebrow label, title, and right-aligned subtitle.
    - Below-header privacy/security banner and then the tool container.

### JSON Formatter Tool Structure
```
src/tools/jsonFormatter/
 ├─ index.tsx                    # Main container component
 ├─ hooks/
 │   └─ useJsonFormatter.ts      # Core logic hook with auto-error clearing
 ├─ components/
 │   ├─ JsonInput.tsx            # Monaco Editor input (editable, line numbers, error highlighting)
 │   ├─ JsonOutput.tsx           # Monaco Editor output (read-only, syntax highlighting)
 │   ├─ EditorPanel.tsx          # Editor wrapper with inline error handling
 │   ├─ TransformActions.tsx     # Transform actions (always visible)
 │   └─ AdvancedPanel.tsx        # Validation and size info
 └─ utils/
     ├─ formatJson.ts            # JSON formatting utility
     ├─ jsonTransformations.ts  # Transform operations
     └─ jsonErrorParser.ts       # Error parsing for line/column extraction
```

### JSON Formatter Main Container (`tools/jsonFormatter/index.tsx`)

- Orchestrates the full JSON formatter experience:
  - Wires `useJsonFormatter` hook to UI components.
  - Manages input/output action state (e.g., last pressed button for subtle highlighting).
  - Defines upload, formatting, minify, copy, clear, and transform interactions.
- Layout:
  - Uses a responsive two-column grid on `lg:` and stacks on smaller viewports:
    - Left: `EditorPanel` with `JsonInput` and input actions.
    - Right: `EditorPanel` with `JsonOutput` and output actions, followed by size info.
  - Hidden file input at the bottom for JSON file uploads.

### JSON Formatter UX Principles
1. **Editors never disappear** - Input editor always remains editable
2. **Errors are inline** - Error messages appear below editor, never replace it
3. **Primary actions always visible** - Format, Minify, Copy, Clear in horizontal toolbar
4. **Transform actions visible** - No accordion, all transform options accessible
5. **Text labels over icons** - Clear button labels for better discoverability
6. **Auto-error clearing** - Errors automatically clear when JSON becomes valid
7. **Professional code editor** - Monaco Editor with line numbers, syntax highlighting, and error markers

### JSON Formatter Technical Details
- **Editor Engine**: Monaco Editor (VS Code editor engine)
- **Input Editor**: Editable with dynamic line numbers, error highlighting, and auto-scroll to errors
- **Output Editor**: Read-only with JSON syntax highlighting and line numbers
- **Error Detection**: Automatic line/column extraction from JSON parse errors
- **Error Highlighting**: Monaco diagnostics API for visual error markers
- **Theme**: Light theme (vs) for neutral, professional appearance

### JSON Formatter Header & Navigation UX
- Minimal, high-clarity header on the JSON Formatter tool page
- Back button in the top-left that returns to Home (`/`), using an inline arrow icon + "Back to Home" label
- Clear hierarchy separating navigation, tool title, and subtitle
- Subtitle explicitly communicates that formatting and validation happen securely in-browser
- Neutral card-style header (light background, subtle border, no heavy shadows) to match modern developer tools

## Design Templates, Layout Patterns & Design System Usage

### Global Layout Patterns

- **Page Shell**
  - `min-h-screen bg-gray-50 py-10/12 px-4 sm:px-6 lg:px-8` for top-level pages (`Home`, `Tool`).
  - Containers are centered via `max-w-4xl`/`max-w-6xl mx-auto`.
- **Cards / Surfaces**
  - `bg-white rounded-lg shadow-sm border border-gray-200 p-6/8` for primary content blocks.
  - Light, low-elevation shadows only; no heavy drop shadows or gradients.
  - Header sections may use slightly tighter padding and optional `bg-gray-50` or `bg-white` with borders.
- **Header Pattern for Tools**
  - Back navigation at the top (left-aligned).
  - Below, a card containing eyebrow, title, and subtitle, often with a responsive flex row where the subtitle can right-align on desktop.
  - Optional trust/security notice immediately under the header.

### Typography & Spacing

- Typography is primarily controlled via Tailwind utility classes:
  - Titles: `text-2xl/3xl/4xl font-bold text-gray-900` depending on hierarchy.
  - Subtitles/body: `text-sm/ text-base/ text-lg text-gray-600`.
  - Eyebrow/labels: `text-xs font-semibold uppercase tracking-wide text-gray-500/600`.
- Spacing:
  - Outer page padding uses consistent `py-10/12` + responsive `px-4 sm:px-6 lg:px-8`.
  - Card padding generally `p-4/6/8` depending on importance.
  - Vertical spacing between sections via `mb-6/10/12` and within components via `gap-*` utilities.

### Color & Visual Language

- Neutral, developer-tool feel based on Tailwind palette:
  - Backgrounds: `bg-gray-50` for page, `bg-white` for surfaces.
  - Borders: `border-gray-200/300` for subtle separation.
  - Text: `text-gray-900` (primary), `text-gray-600/700` (secondary), `text-gray-400` (muted).
  - Accent: `bg-blue-50`, `text-blue-600`, `focus:ring-blue-500` for primary actions and safety messaging.
- Status colors:
  - Success: `text-green-700 bg-green-50/60`.
  - Error: `text-red-700 bg-red-50/60`.

### Reusable Components Inventory

> These are implicit patterns and components that should be reused or extracted when new tools are added.

- **Layout & Navigation**
  - Page container pattern used in `Home` and `Tool`.
  - Back button pattern on JSON Formatter header (`Link` with inline arrow, pill-shaped, subtle hover/focus).
- **Editors & Panels (JSON Formatter)**
  - `EditorPanel`
    - Composes a titled card with header toolbar + inline error area.
    - Responsibility: layout & presentation (does not own business logic).
  - `JsonInput`
    - Monaco editor configured for editable JSON with error markers + scroll-to-error.
  - `JsonOutput`
    - Read-only Monaco editor with same visual baseline as input; shows placeholder message when empty.
  - `PrimaryActions`
    - Horizontal bar for primary JSON operations (Format, Minify, Copy, Clear).
  - `TransformActions`
    - Horizontal list of secondary transform buttons; always visible, text labels only.
  - `AdvancedPanel`
    - Validation + size info, styled as a secondary card.
  - `useJsonFormatter`
    - Single source of truth for JSON formatter state and transform logic, including persistence and validation.

> For future tools, consider extracting some of these into `shared/components` if you need similar patterns (e.g., `EditorPanel`, primary action bars, trust notices, back header).

## UI/UX Principles to Respect

1. **Editor-first, non-destructive UI**
   - Core content editors must remain visible; error states appear inline, not as modal overlays.
2. **Clear, text-first actions**
   - Prefer text buttons with clear labels over icon-only actions (icons may be supplementary).
3. **Minimal, distraction-free visual design**
   - Light surfaces, subtle borders, small shadows, no aggressive gradients or skeuomorphic effects.
4. **Consistent spacing and typography**
   - Use existing Tailwind spacing and text scales already present in `Home` and `Tool` pages.
5. **Trust & privacy made explicit**
   - For tools handling user data, include a clear, concise privacy statement near the top of the tool page.
6. **Accessible interactions**
   - All controls must be keyboard-focusable with visible focus rings (`focus:ring-*`), appropriate ARIA labels, and good color contrast.
7. **Responsive by default**
   - Desktop-first layouts that degrade gracefully via `sm:/md:/lg:` utilities, especially for grids and header alignment.

## Constraints & Guidelines for Future UI Changes

### Structural & Architectural Constraints

- **Tool Integration**
  - Add new tools under `src/tools/<toolId>/` following the `jsonFormatter` structure: `index.tsx`, `hooks/`, `components/`, `utils/`.
  - Expose each tool via `pages/Tool` by branching on `toolId` (and eventually a registry pattern) rather than creating many page-level routes.
- **State Management**
  - Keep tool-specific state inside tool hooks (`useXxxTool`) and component-local state.
  - Use Redux (`store.ts` + slices) only for cross-tool or cross-page concerns; do not over-centralize state prematurely.
- **Routing & Layout**
  - Reuse the `Tool` page layout shell for new tools (same page background, container width, and header/trust section pattern).
  - Keep `Home` as the central discovery point; back buttons should always return to `/`.

### Visual & Layout Guidelines

- **Headers for Tools**
  - Follow the JSON Formatter header pattern:
    - Back button at top-left (`Link` styled as pill, arrow icon + text).
    - Card header with eyebrow label, bold title, and muted subtitle that states both function and privacy guarantees where relevant.
  - Use the same typography scales (`text-2xl/3xl`, `text-sm` subtitle, `text-xs` eyebrow) and spacings.
- **Cards & Surfaces**
  - Use `bg-white rounded-lg shadow-sm border border-gray-200` as the primary surface style.
  - Avoid adding new custom shadow or border schemes unless absolutely required and consistent with existing ones.
- **Actions & Buttons**
  - Use the existing Tailwind combinations as reference:
    - Primary: `bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-blue-500`.
    - Secondary: `bg-white text-gray-600 border border-gray-200 hover:bg-gray-50`.
  - Ensure disabled states use `disabled:opacity-*` and `disabled:cursor-not-allowed` consistently.

### Implementation Guidelines for Upcoming UI

- **When adding a new tool:**
  - Copy the JSON Formatter page-level layout structure from `Tool/index.tsx`:
    - Page shell (`main`), header with back nav + card, trust notice (if applicable), and a tool container card.
  - Implement the tool UI inside a single `index.tsx` under `src/tools/<toolId>/`, composing:
    - A main container component that wires a tool-specific hook to presentational components (mirroring `JsonFormatter`).
    - Editor/preview components that follow the `EditorPanel` pattern if applicable.
- **When adding shared UI primitives:**
  - Promote stable, generic patterns (e.g., a generic `EditorPanel`, a `ToolHeader`, or `TrustNotice`) into `src/shared/components/`.
  - Keep them presentational and configurable via props; avoid coupling them to specific tool logic.
- **When updating styling:**
  - Prefer Tailwind utilities; only add custom CSS in `index.css` when utilities cannot reasonably express the pattern (e.g., keyframes like `fadeIn` that already exist).
  - Ensure new colors, shadows, or spacing still feel aligned with current uses in `Home`, `Tool`, and JSON Formatter components.

## Next Steps
1. Add more tools following JSON Formatter UX patterns and this documented structure.
2. Extract shared layout primitives (`ToolHeader`, `TrustNotice`, `EditorPanel`) into `shared/components` when duplication becomes clear.
3. Wire `Providers` into `main.tsx` once cross-tool Redux state is required.
4. Add error boundaries and loading states around heavy tools (e.g., Monaco-based editors) as the tool catalog grows.
