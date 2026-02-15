// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.philippryce.dev',
  integrations: [
    react(),
    sitemap(),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      SPOTIFY_ACTIVITY_STREAM: envField.string({context: 'client', access: 'public', optional: true}),
    },
  },
  image: {
    responsiveStyles: false,
  },
  trailingSlash: "always",
  compressHTML: false,
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Plus Jakarta Sans',
        cssVariable: '--font-custom',
        weights: [300, 400, 700],
        styles: ["normal", "italic"],
      },
    ],
  },
});
