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
- `postcss.config.js` - PostCSS configuration
- `vite.config.ts` - Vite configuration with path aliases (@)
- `tsconfig.app.json` - TypeScript configuration with path aliases

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
- ⏳ UI components (pending)
- ⏳ Tool implementations (pending)

## Next Steps
1. Implement UI components
2. Build individual tool components
3. Add shared components
4. Implement Redux slices as needed
5. Add error boundaries and loading states
