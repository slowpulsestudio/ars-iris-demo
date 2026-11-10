import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const srcRoot = fileURLToPath(new URL('..', import.meta.url))

// The ARS kit (src/ars-ui) imports Iris through `@iris`; the app imports the kit through `@ars`.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@iris': fileURLToPath(new URL('./src', import.meta.url)),
      '@ars': fileURLToPath(new URL('../ars-ui/src', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  server: { fs: { allow: [srcRoot] } },
})
