# TaskFlow

Project học React: Kanban mini (board → cột → card → comment).

- **Bắt đầu:** đọc [TASKS.md](TASKS.md), làm từ T0.1.
- **Theo dõi tiến độ hiểu bài:** [CONCEPTS.md](CONCEPTS.md).
- **Số liệu tối ưu hiệu năng:** [PERF.md](PERF.md).
- **Bài tập React nâng cao (bug cần sửa / tính năng cần làm):** [LABS.md](LABS.md) — demo ở http://localhost:5173/labs, tự chấm bằng `npm run test:labs`.

```bash
npm install
npm run db:reset   # tạo db.json từ db.seed.json
npm run dev        # http://localhost:5173
npm run api        # http://localhost:3001
npm test           # test của app (xanh)
npm run test:labs  # test bài tập (đỏ cho tới khi bạn sửa)
```

Stack: React 19 · TypeScript · Vite · React Router · json-server · Vitest + Testing Library · oxlint.
