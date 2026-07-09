<script setup lang="ts" generic="T extends string">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'

defineProps<{
  options: readonly T[]
}>()

const modelValue = defineModel<T | null>({ default: null })
</script>

<template>
  <SelectRoot v-model="modelValue">
    <SelectTrigger
      class="inline-flex h-9 items-center justify-between gap-2 rounded-xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-stone-700/10 backdrop-blur-xl backdrop-saturate-150 px-3 text-sm text-stone-900 dark:text-gray-100 outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 transition-colors"
    >
      <SelectValue />
      <SelectIcon>
        <div class="i-tabler-chevron-down h-4 w-4 text-stone-600 dark:text-gray-300" />
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-30 overflow-hidden rounded-xl border border-white/40 dark:border-white/10 bg-white/45 dark:bg-stone-800/50 backdrop-blur-xl backdrop-saturate-150 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]"
      >
        <SelectViewport class="p-1">
          <SelectItem
            v-for="option in options"
            :key="option"
            :value="option"
            class="relative flex h-9 items-center rounded-md pl-8 pr-4 text-sm cursor-pointer outline-none data-[highlighted]:bg-purple-400/20 dark:data-[highlighted]:bg-purple-500/20 transition-colors"
          >
            <SelectItemIndicator
              class="absolute left-2 inline-flex items-center justify-center text-purple-600 dark:text-purple-400"
            >
              <div class="i-mdi-check h-4 w-4" />
            </SelectItemIndicator>
            <SelectItemText class="text-stone-900 dark:text-gray-100">{{ option }}</SelectItemText>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
