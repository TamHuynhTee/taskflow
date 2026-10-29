# TaskFlow

A Kanban app for learning advanced React, built by following the tasks in `TASKS.md`. Stack: React 19, react-router v8 (data router), TypeScript, Vite, json-server, Vitest + Testing Library, oxlint.

## Commands

```bash
npm run api          # json-server on :3001 (reads db.json; npm run db:reset restores the seed)
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build — must be clean before committing
npm run lint         # oxlint
npm test             # main suite ("app" project), must be all green
npm run test:labs    # lab exercises, RED by design
```

## Structure

- `src/app/`: the router (`createAppRouter`) and `RootLayout`.
- `src/api/`: HTTP calls (`client.ts`) and the promise cache for `use()`.
- `src/context/`: Theme, Auth, Toast, Board (reducer and `useCardActions`).
- `src/hooks/`: shared hooks.
- `src/features/<feature>/`: UI and logic per feature. Pure functions live in their own file with a `*.test.ts` next to them.
- `src/components/ui/`: UI primitives (Modal, Field, Tabs, ...).
- `src/labs/NN-name/`: exercises with intentional bugs; instructions are in `LABS.md`.
- `src/dev/Gallery.tsx`: component gallery, opened with `#gallery`.

## Code conventions

- Everything in the repo is in English: docs, comments, UI text, test names.
- Comments explain **why**, not what the code does. When code belongs to a task, add the task id, e.g. `(T4.6)`.
- Use React 19 APIs only: `use()`, `<Context value>`, ref as a regular prop, `useEffectEvent`, `useActionState`, `useOptimistic`.
- **Don't fix the bugs in `src/labs/`** and don't commit lab solutions. The failing lab tests are intentional (except one regression guard, which passes).

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body: why the change was made, no need to retell the diff>

Refs: T4.6
```

- **type**:
  - `feat`: a new feature.
  - `fix`: a bug fix.
  - `refactor`: restructuring without changing behaviour.
  - `test`: adding or changing tests.
  - `docs`: README, TASKS, LABS, CLAUDE.md, comments.
  - `style`: CSS or formatting.
  - `perf`: performance improvements.
  - `chore`: config, dependencies, scripts.
- **scope**:
  - A feature folder name: `boards`, `cards`, `stats`, `settings`, `auth`.
  - Or a layer name: `api`, `hooks`, `context`, `router`, `ui`, `labs`, `test`.
  - Leave the scope out if the change spans many areas.
- **subject**:
  - Imperative mood ("add", not "added").
  - Lowercase first letter, no trailing period, at most ~72 characters.
- **Refs**: the task id from `TASKS.md` or the lab id (e.g. `Lab 06`), if any.
- One logical change per commit. Don't mix a general refactor with a feature.
- Before committing, `npm run build`, `npm test` and `npm run lint` must pass (no lint errors).

Examples:

```
feat(boards): keep previous board visible while switching tabs

Wrap navigation in startTransition so the Suspense fallback does not
replace the current board.

Refs: T4.6
```

```
fix(api): drop rejected promises from cache so retry refetches
```

### Branches

- Don't commit straight to `main`. Create a `<type>/<short-description>` branch, e.g. `feat/card-comments`, `fix/modal-focus-trap`.
- Only commit or push when the user asks.
