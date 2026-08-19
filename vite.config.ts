import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Abio-logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Abio',
        short_name: 'Abio',
        description: 'Abio — link-in-bio profile pages.',
        theme_color: '#171717',
        background_color: '#171717',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache only the built JS/CSS/HTML app shell. Deliberately NOT
        // '**/*.{svg,png,...}' — public/ carries a large icon + image
        // library (platform icons, theme wallpapers, marketing assets) that
        // most users will never touch in a session; recursively precaching
        // it would bloat the install payload for content that isn't wired
        // into any screen yet. Those load from cache on demand instead, the
        // moment a component actually references one.
        //
        // SPA deep links (/$username, /auth/$token, …): without this, the
        // service worker treats those navigations as missing cache entries
        // instead of falling back to the app shell.
        navigateFallback: '/index.html',
        // No runtimeCaching entries are defined for the API: it lives on a
        // separate origin (VITE_API_BASE_URL), so the service worker never
        // intercepts those requests — auth/dashboard/appearance data always
        // goes straight to the network and can't go stale from a cache.
        globPatterns: ['**/*.{js,css,html}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Proxies the API through the dev server so requests are same-origin —
    // no CORS preflight (OPTIONS) noise in the Network tab, and the actual
    // fetch/XHR shows up directly with real request/response values.
    proxy: {
      '/api': {
        target: 'http://localhost:9800',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    clearMocks: true,
  },
})
