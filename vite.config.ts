import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      
      // Layout components
      '@layout': path.resolve(__dirname, './src/shared/components/layout'),
      '@forms': path.resolve(__dirname, './src/shared/components/forms'),
      '@common': path.resolve(__dirname, './src/shared/components/common'),
      '@modals': path.resolve(__dirname, './src/shared/components/modals'),
      '@feedback': path.resolve(__dirname, './src/shared/components/feedback'),
      '@communication': path.resolve(__dirname, './src/shared/components/communication'),
      '@data-display': path.resolve(__dirname, './src/shared/components/data/display'),
      '@buttons': path.resolve(__dirname, './src/shared/components/buttons'),
      '@medical': path.resolve(__dirname, './src/shared/components/medical'),
      '@panels': path.resolve(__dirname, './src/shared/components/panels'),
      '@navigation': path.resolve(__dirname, './src/shared/components/navigation'),
      '@tracking': path.resolve(__dirname, './src/shared/components/tracking'),
      '@cards': path.resolve(__dirname, './src/shared/components/cards'),
      '@dashboard': path.resolve(__dirname, './src/shared/components/dashboard'),
      '@dragdrop': path.resolve(__dirname, './src/shared/components/drag/drop'),
      '@facility': path.resolve(__dirname, './src/shared/components/facility'),
      '@patient': path.resolve(__dirname, './src/shared/components/patient'),
      '@documents': path.resolve(__dirname, './src/shared/components/documents'),
      '@calendar': path.resolve(__dirname, './src/shared/components/calendar'),
      '@scheduling': path.resolve(__dirname, './src/shared/components/scheduling'),
      '@system': path.resolve(__dirname, './src/shared/components/system'),
      '@teleconsult': path.resolve(__dirname, './src/shared/components/teleconsultation'),

      // Shared utilities
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@services': path.resolve(__dirname, './src/shared/services'),
      '@constants': path.resolve(__dirname, './src/shared/constants'),
      '@types': path.resolve(__dirname, './src/shared/types'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@mocks': path.resolve(__dirname, './src/shared/mocks'),
      '@validators': path.resolve(__dirname, './src/shared/validators'),
      '@calculators': path.resolve(__dirname, './src/shared/calculators'),
      '@formatters': path.resolve(__dirname, './src/shared/formatters'),
      '@transformers': path.resolve(__dirname, './src/shared/transformers'),
      '@filters': path.resolve(__dirname, './src/shared/filters'),
      '@sorters': path.resolve(__dirname, './src/shared/sorters'),
      '@config': path.resolve(__dirname, './src/shared/config'),
      '@builders': path.resolve(__dirname, './src/shared/builders'),
      '@contexts': path.resolve(__dirname, './src/shared/contexts'),
      '@enums': path.resolve(__dirname, './src/shared/enums'),
      '@parsers': path.resolve(__dirname, './src/shared/parsers'),
      '@generators': path.resolve(__dirname, './src/shared/generators'),
      '@mappers': path.resolve(__dirname, './src/shared/mappers'),

      // Pages
      '@router': path.resolve(__dirname, './src/router'),
      '@admin': path.resolve(__dirname, './src/pages/admin'),
      '@secretary-primary': path.resolve(__dirname, './src/pages/secretary-primary'),
      '@doctor': path.resolve(__dirname, './src/pages/doctor'),
      '@nurse': path.resolve(__dirname, './src/pages/nurse'),
      '@secretary-secondary': path.resolve(__dirname, './src/pages/secretary-secondary'),
      '@shared-admin': path.resolve(__dirname, './src/pages/shared/administrative'),
      '@shared-medical': path.resolve(__dirname, './src/pages/shared/medical'),
      '@shared-technical': path.resolve(__dirname, './src/pages/shared/technical')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})