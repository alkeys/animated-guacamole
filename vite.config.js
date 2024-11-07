import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
      outDir: 'dist', // This ensures the output goes to 'dist'
    },
    server: {
      host: true, // Esto permite que Vite esté accesible en la red local
      port: 5173, // Puedes cambiarlo a otro puerto si el 5173 está ocupado
    },
  });