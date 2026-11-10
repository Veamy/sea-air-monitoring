# Sea and air monitoring web UI

Web client for a ground-based monitoring system that tracks sea and air objects in a port area, its approaches and the airspace above them. The system is built for observation, record keeping and planning; it does not handle target selection or weapons control.

## Status

Work in progress: the project skeleton is being set up.

## Tech stack

- Vite + React + TypeScript
- React Router
- TanStack Query for server state
- Storybook as the component catalog
- Vitest + React Testing Library
- MSW mock API with configurable latency and error injection
- ESLint and Prettier

The design system is not chosen yet; the choice and its reasoning will go to `docs/decisions.md`.

## Getting started

```bash
npm install
npm run dev          # development server
npm run lint         # ESLint
npm test             # Vitest
npm run build        # production build
npm run storybook    # component catalog
npm run build-storybook
```

## Documentation

`docs/` holds the requirements, architecture and design decisions.
