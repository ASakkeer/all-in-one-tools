# Architecture Documentation

## Project Overview
All-in-one tools application built with React, TypeScript, Vite, Tailwind CSS, Redux Toolkit, and React Router.

## Current Workflow

### Project Structure
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

### Technology Stack
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

### Development Status
- ✅ Project structure created
- ✅ Routing configured
- ✅ Tailwind CSS set up
- ✅ Redux store configured
- ✅ JSON Formatter tool implemented

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

## Next Steps
1. Add more tools following JSON Formatter UX patterns
2. Add shared components as needed
3. Implement Redux slices for cross-tool state if needed
4. Add error boundaries and loading states
