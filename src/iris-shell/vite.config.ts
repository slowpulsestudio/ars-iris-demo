import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const reviewNotesFile = fileURLToPath(new URL('../../docs/review-notes.md', import.meta.url))

/** Dev only: lets the Design review tasks page read and tick items in docs/review-notes.md. */
function reviewNotesEndpoint(): Plugin {
  return {
    name: 'review-notes-endpoint',
    configureServer(server) {
      server.middlewares.use('/__review-notes', (req, res) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(fs.readFileSync(reviewNotesFile, 'utf8'))
          return
        }
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          try {
            const { line, checked } = JSON.parse(body) as { line: number; checked: boolean }
            const lines = fs.readFileSync(reviewNotesFile, 'utf8').split('\n')
            // Only a task line can change, and only its checkbox.
            if (!Number.isInteger(line) || !/^- \[[ x]\] /.test(lines[line] ?? '')) {
              res.statusCode = 400
              res.end('Not a task line')
              return
            }
            lines[line] = lines[line].replace(/^- \[[ x]\]/, checked ? '- [x]' : '- [ ]')
            const text = lines.join('\n')
            fs.writeFileSync(reviewNotesFile, text)
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            res.end(text)
          } catch {
            res.statusCode = 400
            res.end('Bad request')
          }
        })
      })
    },
  }
}

// The ARS kit (src/ars-ui) imports Iris through `@iris`; the app imports the kit through `@ars`.
export default defineConfig({
  plugins: [react(), reviewNotesEndpoint()],
  resolve: {
    alias: {
      '@iris': fileURLToPath(new URL('./src', import.meta.url)),
      '@ars': fileURLToPath(new URL('../ars-ui/src', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  // The repo root, so the app can read docs/review-notes.md.
  server: { fs: { allow: [repoRoot] } },
})
