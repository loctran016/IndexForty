<script setup lang="ts">
const { $pwa } = useNuxtApp()
const route = useRoute()
const pageTitle = computed(() => (route.meta.title as string) ?? '')
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

useHead({
  htmlAttrs: {
    class: 'scrollbar-none',
  },
})
</script>

<template>
  <div
    class="w-full bg-stone-50 text-stone-900 dark:bg-stone-900 dark:text-gray-100 scrollbar-thin font-sans h-screen flex flex-col overflow-hidden"
  >
    <img
      src="/blob-bg.svg"
      alt=""
      aria-hidden="true"
      class="fixed inset-0 w-full h-full object-cover object-top-left z-0 opacity-60 dark:opacity-60 pointer-events-none"
    />

    <header
      class="sticky top-0 z-20 border-b border-white/40 dark:border-white/10 bg-white/30 dark:bg-stone-700/30 backdrop-blur-xl backdrop-saturate-150 shrink-0"
    >
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2">
        <span class="text-xl font-medium font-head truncate">{{ pageTitle }}</span>
        <NavBar />
      </div>
    </header>

    <ScrollAreaRoot style="--scrollbar-size: 18px" class="flex-1 min-h-0">
      <ScrollAreaViewport class="w-full h-full">
        <main class="mx-auto px-4 max-w-9/10 lg:max-w-5/6 w-full self-stretch">
          <slot />
        </main>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar
        class="flex select-none touch-none p-0.5 z-20 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="vertical"
      >
        <ScrollAreaThumb
          class="flex-1 bg-purple-500/40 hover:bg-purple-500/70 dark:bg-purple-400/30 dark:hover:bg-purple-400/60 rounded-full relative before:content-'' before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-44px before:min-h-44px"
        />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>

    <NuxtPwaManifest />
  </div>
</template>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  margin: 0;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
