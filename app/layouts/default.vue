<script setup>
const { $pwa } = useNuxtApp()

// const toast = useToast()

// onMounted(() => {
//   if ($pwa.offlineReady) toast.success('App ready to work offline')
// })
</script>

<template>
  <!-- <div class="w-full bg-stone-50/20 text-stone-900 scrollbar-track-op-0 scrollbar-thin"> -->
  <div
    class="w-full bg-stone-50/20 text-stone-900 dark:bg-stone-900 dark:text-gray-100 scrollbar scrollbar-track-op-0 scrollbar-thin font-sans min-h-screen"
  >
    <NavBar />
    <slot />
  </div>
  <!-- <div
    v-show="$pwa.needRefresh"
    class="fixed bottom-2 right-2 bg-stone-400/50 backdrop-blur-2xl border-stone-500/30 p-4"
  >
    <span> New content available, click on reload button to update. </span>

    <button @click="$pwa.updateServiceWorker()">Reload</button>
  </div> -->
  <NuxtPwaManifest />
</template>

<style>
html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  margin: 0;
  /* background: #1c1917; */
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
