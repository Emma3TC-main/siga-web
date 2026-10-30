import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/.well-known/jwks.json': 'http://127.0.0.1:8081',
      '/api/v1/auth': 'http://127.0.0.1:8081',
      '/api/v1/users': 'http://127.0.0.1:8081',
      '/api/v1/roles': 'http://127.0.0.1:8081',
      '/api/v1/permissions': 'http://127.0.0.1:8081',
      '/api/v1/products': 'http://127.0.0.1:8082',
      '/api/v1/categories': 'http://127.0.0.1:8082',
      '/api/v1/units': 'http://127.0.0.1:8082',
      '/api/v1/suppliers': 'http://127.0.0.1:8082',
      '/api/v1/inventory': 'http://127.0.0.1:8083',
      '/api/v1/movements': 'http://127.0.0.1:8083',
      '/api/v1/locations': 'http://127.0.0.1:8083',
      '/api/v1/admin/lots': 'http://127.0.0.1:8083',
      '/api/v1/admin/assets': 'http://127.0.0.1:8083',
      '/api/v1/lots': 'http://127.0.0.1:8083',
      '/api/v1/assets': 'http://127.0.0.1:8083',
      '/api/v1/counts': 'http://127.0.0.1:8083',
      '/api/v1/audit-events': 'http://127.0.0.1:8085',
      '/api/v1/notifications': 'http://127.0.0.1:8085',
      '/api/v1/evidences': 'http://127.0.0.1:8084',
      '/api/v1/dashboard': 'http://127.0.0.1:8086',
      '/api/v1/reports': 'http://127.0.0.1:8086',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
