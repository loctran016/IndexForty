import { defineConfig, presetWind4, presetIcons, presetWebFonts } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide'
export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons(),
    presetWebFonts({
      provider: 'google', // default provider
      fonts: {
        // these will extend the default theme
        sans: 'Inter',
        head: 'Space Grotesk',
        // mono: ["Fira Code", "Fira Mono:400,700"],
        // custom ones
      },
    }),
    presetScrollbar()
  ],
  shortcuts: {
    card: 'rounded-2xl bg-white/45 dark:bg-stone-800/50 backdrop-blur-xl backdrop-saturate-150 border border-white/40 dark:border-white/10 p-6',
    'scrollbar-thin-all': `scrollbar:w-2 scrollbar:h-2 scrollbar-thin`,
  },
})
