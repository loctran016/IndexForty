<script setup lang="ts">
import {
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from 'reka-ui'

const { $pwa } = useNuxtApp()

const showUpdateToast = computed(() => Boolean($pwa?.needRefresh))
const showOfflineToast = ref(false)

watch(
  () => $pwa?.offlineReady,
  (ready) => {
    if (!ready) return
    showOfflineToast.value = true
    setTimeout(() => (showOfflineToast.value = false), 4000)
  },
)

function reloadApp() {
  $pwa?.updateServiceWorker()
}

function dismissUpdate() {
  $pwa?.cancelPrompt?.() // omit safely if your $pwa version doesn't expose this
}
</script>

<template>
  <ToastProvider swipe-direction="right" :duration="6000">
    <ToastRoot
      :open="showUpdateToast"
      class="card flex items-center gap-3 pointer-events-auto"
      @update:open="(v) => !v && dismissUpdate()"
    >
      <div class="i-mdi:cloud-download-outline text-2xl text-purple-500 shrink-0" />
      <div class="flex-1 min-w-0">
        <ToastTitle class="text-sm font-medium">Update available</ToastTitle>
        <ToastDescription class="text-xs opacity-70">
          New content is ready — refresh to update.
        </ToastDescription>
      </div>
      <ToastAction as-child alt-text="Refresh now">
        <button
          type="button"
          class="text-xs px-3 py-1.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 transition-colors cursor-pointer shrink-0"
          @click="reloadApp"
        >
          Refresh
        </button>
      </ToastAction>
      <ToastClose as-child aria-label="Dismiss">
        <button
          type="button"
          class="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shrink-0 cursor-pointer"
          @click="dismissUpdate"
        >
          <div class="i-mdi:close text-sm" />
        </button>
      </ToastClose>
    </ToastRoot>

    <ToastRoot
      :open="showOfflineToast"
      class="card flex items-center gap-3 pointer-events-auto"
      @update:open="(v) => (showOfflineToast = v)"
    >
      <div class="i-mdi:check-circle-outline text-2xl text-emerald-500 shrink-0" />
      <ToastDescription class="text-sm">Ready to work offline.</ToastDescription>
    </ToastRoot>

    <ToastViewport
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] pointer-events-none outline-none"
    />
  </ToastProvider>
</template>
