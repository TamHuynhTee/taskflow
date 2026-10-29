import react from '@vitejs/plugin-react'
import { configDefaults, defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Tests don't need simulated network delay.
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
        // Exercises: tests are RED until you fix them — see LABS.md.
        extends: true,
        test: { name: 'labs', include: ['src/labs/**/*.test.{ts,tsx}'] },
      },
    ],
  },
})
