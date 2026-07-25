// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// ─────────────────────────────────────────────────────────────
//  Build mode / deployment target
// ─────────────────────────────────────────────────────────────
//  Astro 7+: "static" (default) behaves like the old "hybrid" mode.
//  Every page/route defaults to STATIC (prerendered), CDN cached, fast, great for SEO/performance.
//  Any page / API route that opts-in with `export const prerender = false`
//  will be rendered ON DEMAND (Vercel Serverless).
//  Currently only src/pages/api/contact.ts needs this.
//
//  SWITCHING DEPLOY TARGETS — swap the import + adapter:
//   Vercel (current):
//       import vercel from '@astrojs/vercel'
//       adapter: vercel({ functionPerRoute: false, edgeMiddleware: false, ... })
//   Netlify:
//       npm i @astrojs/netlify
//       import netlify from '@astrojs/netlify' ; adapter: netlify()
//   Node standalone server:
//       npm i @astrojs/node
//       import node from '@astrojs/node' ; adapter: node({ mode: 'standalone' })
//   Cloudflare Pages:
//       npm i @astrojs/cloudflare
//       import cloudflare from '@astrojs/cloudflare'
//       adapter: cloudflare({ mode: 'directory' })
// ─────────────────────────────────────────────────────────────

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel({
    // For hybrid: bundle SSR routes into fewer, larger functions
    functionPerRoute: false,
    edgeMiddleware: false,
    // Analytics + Speed Insights (toggle when deploying to Vercel):
    // webAnalytics: { enabled: true },
    // speedInsights: { enabled: true },
    imageService: true,
    devImageService: 'sharp',
    cacheDir: '.vercel/cache',
  }),
  site:
    process.env.SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    'https://danero.dev',
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
    assetsInclude: ['**/*.glb'],
    ssr: {
      noExternal: [],
    },
    build: {
      cssMinify: 'lightningcss',
      minify: true,
      sourcemap: false,
      reportCompressedSize: true,
      target: 'es2020',
    },
  },
  integrations: [react()],
  compressHTML: true,
  scopedStyleStrategy: 'where',
  devToolbar: {
    enabled: true,
  },
  server: {
    port: 4321,
    host: true,
    open: false,
  },
  prefetch: {
    defaultStrategy: 'hover',
    prefetchAll: true,
  },
  redirects: {},
  security: {
    checkOrigin: true,
  },
  experimental: {
    // Enable future-safe env handling when available
  },
});
