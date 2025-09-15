import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [],
    include: ['react', 'react-dom', 'react-router-dom']
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts'],
          utils: ['axios', 'date-fns'],
          // Split large components
          'mui-extended': ['@mui/lab', '@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
        }
      }
    },
    chunkSizeWarningLimit: 500 // Warn if chunks are larger than 500KB
  }
})
