import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Test không cần giả lập độ trễ mạng.
    env: { VITE_API_DELAY: '0', VITE_API_FAIL_RATE: '0' },
    projects: [
      {
        extends: true,
        test: {
          name: 'app',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: [...configDefaults.exclude, 'src/labs/**'],
        },
      },
      {
        // Bài tập: test ĐỎ cho tới khi bạn sửa xong — xem LABS.md.
        extends: true,
        test: { name: 'labs', include: ['src/labs/**/*.test.{ts,tsx}'] },
      },
    ],
  },
})
