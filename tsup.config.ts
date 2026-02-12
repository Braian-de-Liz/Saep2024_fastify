import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  clean: true,
  bundle: true,
  minify: false,
  target: 'node22',
  platform: 'node',
  external: ['@prisma/client', '.prisma/client'], 
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});