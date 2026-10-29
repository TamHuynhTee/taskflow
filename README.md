# TaskFlow

A React learning project: a mini Kanban (board → column → card → comment).

- **Getting started:** read [TASKS.md](TASKS.md) and start at T0.1.
- **Track what you understand:** [CONCEPTS.md](CONCEPTS.md).
- **Performance numbers:** [PERF.md](PERF.md).
- **Advanced React exercises (bugs to fix / features to build):** [LABS.md](LABS.md) — demos at http://localhost:5173/labs, check yourself with `npm run test:labs`.

```bash
npm install
npm run db:reset   # create db.json from db.seed.json
npm run dev        # http://localhost:5173
npm run api        # http://localhost:3001
npm test           # app tests (green)
npm run test:labs  # exercise tests (red until you fix them)
```

Stack: React 19 · TypeScript · Vite · React Router · json-server · Vitest + Testing Library · oxlint.
