// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  watch: ['~/uno.config.ts'],
  modules: [
    '@unocss/nuxt',
    '@formkit/auto-animate',
    '@vueuse/nuxt',
    'motion-v/nuxt',
    '@nuxtjs/supabase',
    'nuxt-echarts',
    '@nuxt/eslint',
    '@vite-pwa/nuxt',
    '@regle/nuxt',
    '@nuxtjs/cloudinary',
    'nuxt-easy-lightbox',
    '@vercel/speed-insights'
  ],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', '@internationalized/date', 'reka-ui'],
    },
  },
  routeRules: {
    '/manifest.webmanifest': { ssr: false, prerender: false },
    '/dev-sw.js': { ssr: false, prerender: false },
    '/sw.js': { ssr: false, prerender: false },
  },
  runtimeConfig: {
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  echarts: {
    renderer: 'svg',
    charts: ['BarChart', 'LineChart', 'PieChart', 'HeatmapChart'],
    components: [
      'GridComponent',
      'TooltipComponent',
      'LegendComponent',
      'CalendarComponent',
      'VisualMapComponent',
    ],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        {
          innerHTML: `(function(){var c=document.cookie.match(/theme-preference=([^;]+)/);var p=c?c[1]:'system';var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)})()`,
          type: 'text/javascript',
          tagPosition: 'head',
          tagPriority: 'critical',
        },
      ],
      //   link: [
      //     { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      //     { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      //   ],
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  supabase: {
    useSsrCookies: true, // This should be true for SSR support
    redirect: false,
  }
})
