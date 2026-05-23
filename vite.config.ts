import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ancient-egyptian-tomb/',
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
})
