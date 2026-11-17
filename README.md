# Sea and air monitoring web UI

Web client for the duty operator's **event log** (ARGUS, topic 1: automated workstation of the shift duty officer of the surface and air situation monitoring center). The interface shows the stream of events, lets the operator filter and select events, and records status changes. It is built for observation and record keeping only; it has no target selection or weapon functions.

## Status

- Event log view with table, filters, detail panel with history, status change, auto-refresh and high-priority counter (R1–R9).
- Four states on the view: loading, error with retry, empty data with a reason, and data.
- Storybook catalog for every presentational component and every view state.
- Unit, component and page tests, including the main scenario (filter, select, change status).
- Known gaps: browser checks of the responsive layout and keyboard navigation were not completed, and contrast was not measured. See [docs/deviations.md](docs/deviations.md) and [docs/compliance.md](docs/compliance.md).

## Tech stack

| Area              | Choice                                       |
| ----------------- | -------------------------------------------- |
| UI                | React 18, TypeScript                         |
| Design system     | IBM Carbon (`@carbon/react`), Gray 100 theme |
| Routing           | React Router 6                               |
| Server state      | TanStack Query 5                             |
| Mock API          | MSW 2 with latency and error switches        |
| Component catalog | Storybook 8                                  |
| Tests             | Vitest, Testing Library                      |
| Quality           | ESLint, Prettier                             |
| Build             | Vite                                         |

## Requirements

Node.js 20 or later and npm.

## Install and run

```bash
npm install
npm run dev              # development server with the mock API (http://localhost:5173)
```

In development the mock API starts automatically (`src/main.tsx`). Latency and error injection are configured in `src/mocks/config.ts`.

## Quality checks

```bash
npm run lint             # ESLint, zero warnings
npm run format:check     # Prettier check
npx tsc -b               # type check
npm test                 # Vitest, unit and component tests
npm run build            # type check and production build
npm run storybook        # component catalog at http://localhost:6006
npm run build-storybook  # static catalog in storybook-static/
```

## Project layout

```
src/
  api/          HTTP client and query client settings
  components/   shared loading, error and empty states
  domain/       event model, filtering, sorting, counters
  features/     event-log view (table, filters, detail, container)
  hooks/        TanStack Query hooks
  layout/       app frame with header and counter
  lib/          time formatting
  mocks/        MSW handlers and seed data
  styles/       application CSS on top of Carbon tokens
  theme/        theme and control size
```

## Documentation

- [docs/requirements.md](docs/requirements.md): user tasks, constraints, requirements R1–R9 and N1–N8
- [docs/decisions.md](docs/decisions.md): design system choice, alternatives, libraries, rejected variants
- [docs/architecture.md](docs/architecture.md): views, routes, components, state, data flow, diagrams
- [docs/compliance.md](docs/compliance.md): requirement-to-code-to-verification table
- [docs/deviations.md](docs/deviations.md): changes against the plan and known limitations
