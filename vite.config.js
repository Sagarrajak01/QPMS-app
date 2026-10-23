import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split heavy libraries into their own chunks
            if (id.includes('html2pdf.js')) return 'vendor-pdf';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
            if (id.includes('axios')) return 'vendor-axios';
            
            // Catch-all for remaining dependencies
            return 'vendor';
          }
        }
      }
    },
    // Safely increase the warning limit to 1000 kB for hybrid mobile apps
    chunkSizeWarningLimit: 1000
  }
});
