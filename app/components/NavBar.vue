<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDark, useToggle, useLocalStorage } from '@vueuse/core'

/**
 * Persisted user preference:
 * - 'light' | 'dark' | 'system'
 */
const themePref = useLocalStorage<'light' | 'dark' | 'system'>('theme-preference', 'system')

/**
 * Tracks actual dark state on <html class="dark">.
 * disableTransition avoids flash during toggle.
 */
const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  disableTransition: false,
})

const toggleDark = useToggle(isDark)

// Apply preference to actual theme
const applyTheme = () => {
  if (themePref.value === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    return
  }
  isDark.value = themePref.value === 'dark'
}

onMounted(() => {
  applyTheme()

  // react to OS theme changes when in system mode
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => {
    if (themePref.value === 'system') applyTheme()
  }
  mq.addEventListener('change', handler)

  // cleanup
  onBeforeUnmount(() => mq.removeEventListener('change', handler))
})

// Cycle: system -> dark -> light -> system
function cycleTheme() {
  if (themePref.value === 'system') themePref.value = 'dark'
  else if (themePref.value === 'dark') themePref.value = 'light'
  else themePref.value = 'system'
  applyTheme()
}

const iconClass = computed(() => {
  if (themePref.value === 'system') return 'i-tabler:device-laptop'
  if (themePref.value === 'dark') return 'i-mdi:weather-night'
  return 'i-mdi:white-balance-sunny'
})

const buttonClass = computed(() => {
  if (themePref.value === 'dark') {
    return 'hover:bg-stone-100/10 hover:text-white'
  }
  if (themePref.value === 'light') {
    return 'hover:bg-orange-100/50 hover:text-orange-400'
  }
  return ''
})
</script>

<template>
  <ul
    class="fixed left-1/2 -translate-x-1/2 border-rounded-full bg-gray-800/10 border-gray-400/10 dark:bg-gray-300/10 dark:border-gray-100/10 w-max flex gap-3 items-center justify-center top-4 z-100 border-1 backdrop-blur-2xl transition-all duration-300 scale-90 -translate-y-1 hover:translate-y-0 hover:scale-100 backdrop-blur-md -backdrop-brightness-10"
  >
    <li>
      <NuxtLink to="/">
        <IconNavBarWrapper><div class="i-mdi:home" /></IconNavBarWrapper>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/fitness-tracker">
        <IconNavBarWrapper><div class="i-mdi:weight-lifter" /></IconNavBarWrapper>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/musical">
        <IconNavBarWrapper><div class="i-mdi:music-clef-treble" /></IconNavBarWrapper>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/gallery">
        <IconNavBarWrapper><div class="i-solar:gallery-round-bold" /></IconNavBarWrapper>
      </NuxtLink>
    </li>

    <!-- Client-only to avoid SSR/theme hydration drift -->
    <ClientOnly>
      <li>
        <button
          class="cursor-pointer duration-200 border-rounded-full text-lg lg:text-xl p-3 flex items-center justify-center transition-all"
          :class="buttonClass"
          @click="cycleTheme"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <div :class="iconClass" />
        </button>
      </li>
      <template #fallback>
        <li>
          <button
            class="cursor-pointer duration-200 border-rounded-full text-lg lg:text-xl p-3 flex items-center justify-center cursor-progress"
            disabled
          >
            <div class="i-tabler:device-laptop" />
          </button>
        </li>
      </template>
    </ClientOnly>
  </ul>
</template>
