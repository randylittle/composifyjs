import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'composifyjs',
      fileName: (format) => `index.${format}.js`,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
  plugins: [dts()],
});
