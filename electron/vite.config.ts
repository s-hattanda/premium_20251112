import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        main: path.resolve(__dirname, 'main.ts'),
        preload: path.resolve(__dirname, 'preload.ts'),
      },
      formats: ['cjs'],
    },
    outDir: path.resolve(__dirname, '../dist-electron'),
    rollupOptions: {
      external: ['electron', 'electron-store', 'path', 'url'],
      output: {
        entryFileNames: '[name].js',
        format: 'cjs',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});

