import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: 'minimal-2023',
  images: ['/public/logo.svg'], // single source image
})
