# Design decisions

This file records the decisions behind the event log interface: the design system (report 2.3), the other libraries (report 2.5) and the rejected variants (report 2.7). Requirement IDs (R1–R9, N1–N8) refer to [requirements.md](requirements.md).

## 1. Design system: IBM Carbon

**Decision.** IBM Carbon for React (`@carbon/react` 1.68.0) with its compiled stylesheet (`@carbon/styles`), the Gray 100 theme (`g100`) and the `sm` control size. Source: `src/theme/theme.ts`, `src/main.tsx`.

**Requirements that drive the choice.**

| Requirement                                            | Why Carbon fits                                                                                                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1 (fixed workstation, 8–12 h shift), N3 (WCAG 2.1 AA) | Carbon is designed against WCAG 2.1 AA; its Gray 100 theme is a dark, low-glare theme for long shifts.                                               |
| N2 (keyboard, visible focus)                           | Interactive components come with a focus ring and keyboard handling (Select, Search, Button, Table).                                                 |
| R1, R4, R6 (table, filters, detail)                    | Table, Select, Search, TextInput (datetime-local), Tag, InlineNotification and InlineLoading cover every control in the view without custom widgets. |
| N4 (Ukrainian text)                                    | Components accept plain strings, so all UI text is ours; no built-in English strings are shown in the view.                                          |
| Assignment, work topic 1                               | The department's sample report uses IBM Carbon Gray 100, so the project matches the reference design language.                                       |
| Maintenance                                            | Apache-2.0 license, one vendor, React 18 support, components documented in Storybook.                                                                |

**Trade-offs accepted.** The compiled stylesheet is large (about 1.2 MB uncompressed, about 115 kB gzip in the production build). The table and filter components follow Carbon's visual language and are less compact than a custom table would be. Both are acceptable for a single-screen workstation application; a per-component stylesheet could reduce the size later.

## 2. Alternatives compared

Each candidate is an open-source React design system with a license that allows use in a coursework project.

| Criterion (requirement)                     | IBM Carbon (chosen)                                   | MUI (Material UI)                                                  | Ant Design                                                | Fluent UI React v9                                              |
| ------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------- |
| License                                     | Apache-2.0                                            | MIT                                                                | MIT                                                       | MIT                                                             |
| Accessibility focus (N2, N3)                | Explicit WCAG 2.1 AA target, documented per component | Good ARIA support, theme contrast must be checked by hand          | Good ARIA support in v5; contrast must be checked by hand | Accessibility is a stated design goal; focus handling is strong |
| Dark theme for long shifts (C1)             | Built-in Gray 100 and Gray 90 themes                  | Dark palette via theme mode; all colors are configured by the team | Dark algorithm via theme config                           | Dark theme token set provided                                   |
| Dense table and filters (R1, R4)            | Table with size scale, Select, Search, Tag            | DataGrid (advanced parts in the paid tier), TextField, Select      | Strong Table with built-in filters and compact algorithm  | Table primitives only; more assembly needed                     |
| Visual language for a state-monitoring tool | Enterprise and data-oriented                          | Consumer-oriented Material look                                    | Enterprise look, dense by default                         | Windows/Microsoft 365 look                                      |
| Department reference                        | Same system as the sample report                      | Not in the sample                                                  | Not in the sample                                         | Not in the sample                                               |

**Why the others were rejected.**

- **MUI.** A good option and the most widely used library, but its advanced data grid features are in a paid tier, and the default look is consumer-oriented. Dark and contrast tuning would be done by us, which moves the N3 work from the library to the project.
- **Ant Design.** Strong table and filter components, but the default visual density and the Chinese-language documentation origin make the choice less attractive for a Ukrainian-language, accessibility-first interface. Its accessibility story is less explicit than Carbon's.
- **Fluent UI React v9.** Accessibility and the token system are strong, but it offers fewer ready-made data components. The table, filter and status pieces would have to be built from primitives, which is more code for the same result.

## 3. Libraries and other choices

| Area              | Choice                                                                                           | Why                                                                                           | Alternatives rejected                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Build tool        | Vite                                                                                             | Fast dev server, TypeScript out of the box, MSW integration                                   | Create React App (deprecated), Webpack (slower to configure)                                                           |
| Routing           | React Router 6                                                                                   | Standard routing; URL holds the filter and selection state                                    | TanStack Router (less familiar for the course); no router (state would be lost on reload)                              |
| Server state      | TanStack Query 5                                                                                 | Caching, polling (`refetchInterval`, R3), retries and invalidation after a status change (R7) | Redux Toolkit Query (more setup for one resource); hand-written `useEffect` fetching (no cache, no polling primitives) |
| Client UI state   | URL query string (filters, selected event) and local `useState` (refresh interval, draft status) | Filters and selection survive auto-refresh and reloads (R3, R5) without a global store        | Redux or Zustand store (not needed for this state size)                                                                |
| Mock API          | MSW 2 with in-memory handlers, latency and error switches                                        | The interface can show all four states on demand (R9) without a server                        | json-server (no error injection without extra code)                                                                    |
| Component catalog | Storybook 8 (with the a11y addon)                                                                | Each component and each view state has a story (N8)                                           | Ladle (less ecosystem support in this stack)                                                                           |
| Tests             | Vitest 2 + Testing Library + user-event                                                          | Same toolchain as Vite; component and page tests run in jsdom                                 | Jest (needs a separate transform setup with Vite)                                                                      |
| Lint and format   | ESLint 9 (typescript-eslint, react-hooks, react-refresh) + Prettier                              | Zero-warning lint gate (N7)                                                                   | Biome (single tool, but less common in the course materials)                                                           |
| Time handling     | `Intl.DateTimeFormat` and native `datetime-local`                                                | No date library needed; local and UTC formats are shown through standard APIs (N5)            | date-fns or Day.js (extra dependency for a few formats)                                                                |

## 4. Theme and density

- **Theme: Gray 100 (`g100`).** A dark theme is less glaring during an 8–12 h shift on a fixed monitor (C1). Status colors come from Carbon tags, which are checked by IBM for contrast on their own backgrounds.
- **Density: `sm` controls and a compact table.** The event table must show seven columns at 1024 px without page scrolling (N1); the small control size keeps rows short so that more events fit on one screen.

## 5. Rejected variants and when to reconsider them

| Variant rejected                                      | Reason                                                                                                 | Reconsider when                                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Light theme                                           | Glare on long shifts; the department sample uses a dark theme                                          | The workstation moves to a brightly lit room and operators ask for it; a light theme is a token switch in Carbon. |
| Multi-select filters (several types or zones at once) | The single-select controls already cover the typical search; multi-select adds state and test cases    | Operators need to compare two or three types in one view.                                                         |
| Server-side filtering and pagination                  | A shift has a small number of events; client-side filtering with `applyFilter` is simpler and testable | One shift produces thousands of events, or the server offers a filter API.                                        |
| WebSocket push instead of polling                     | The current API has no push channel; polling at 10–60 s meets R3                                       | The server publishes events over a push channel and latency must be below a few seconds.                          |
| Detail as a modal dialog                              | A modal hides the table; operators must compare the detail with the list (T3)                          | Screens narrower than 1024 px must be supported, where the detail should become a full-screen view.               |
| Global store (Redux) for filters                      | Filters and selection fit in the URL; a store would duplicate the router state                         | Several views must share client state that cannot live in the URL.                                                |
| Carbon compiled CSS split per component               | The gain (about 1 MB less) does not change the workstation experience                                  | The bundle size becomes a problem, for example on a slow network.                                                 |
