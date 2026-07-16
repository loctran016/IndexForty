<script setup lang="ts">
import { ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from 'reka-ui'

withDefaults(
  defineProps<{
    maxHeight?: string
  }>(),
  {
    maxHeight: undefined,
  },
)
</script>

<template>
  <ScrollAreaRoot class="relative overflow-hidden" :style="maxHeight ? { maxHeight } : undefined">
    <ScrollAreaViewport class="w-full h-full">
      <slot />
    </ScrollAreaViewport>
    <ScrollAreaScrollbar
      class="absolute right-0 bottom-0 flex select-none touch-none p-0.5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
      orientation="vertical"
    >
      <ScrollAreaThumb
        class="flex-1 bg-purple-500/40 hover:bg-purple-500/70 dark:bg-purple-400/30 dark:hover:bg-purple-400/60 rounded-full relative before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]"
      />
    </ScrollAreaScrollbar>
  </ScrollAreaRoot>
</template>
