// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@formkit/auto-animate',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxt/image',
    '@nuxtjs/supabase',
    'nuxt-echarts',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    '@regle/nuxt',
    '@nuxtjs/cloudinary',
    'nuxt-easy-lightbox',
  ],
  runtimeConfig: {
    // server-only, never sent to the client
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  supabase: {
    useSsrCookies: true, // This should be true for SSR support
    redirect: false,
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/loctran016/image/upload',
    },
  },
  pwa: {
    manifest: {
      name: 'IndexForty',
      theme_color: '#ffffff',
      // icons are auto-injected — no need to list them manually
    },
    pwaAssets: {
      config: true, // reads pwa-assets.config.ts automatically
      // overrideManifestIcons: true  ← set if you already have icons defined
    },
  },
})
