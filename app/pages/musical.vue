<template>
  <main class="p-8">
    <ComboboxRoot v-model="selectedTunePath" class="relative">
      <ComboboxAnchor
        class="min-w-[160px] inline-flex items-center justify-between rounded-lg border border-stone-800/30 px-[15px] text-xs leading-none h-[35px] gap-[5px] bg-white/50 hover:bg-stone-50/50 transition-all duration-200 shadow-sm focus:shadow-[0_0_0_2px] focus:shadow-black outline-none"
      >
        <ComboboxInput
          class="!bg-transparent outline-none h-full placeholder-stone-400"
          placeholder="Search a tune..."
        />
        <ComboboxTrigger>
          <Icon icon="radix-icons:chevron-down" class="h-4 w-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>

      <ComboboxContent
        class="absolute z-10 w-full mt-1 min-w-[160px] bg-white overflow-hidden rounded-lg shadow-sm border will-change-[opacity,transform]"
      >
        <ComboboxViewport class="p-[5px]">
          <ComboboxEmpty class="text-xs font-medium text-center py-2 text-stone-400" />

          <ComboboxItem
            v-for="tune in tuneList"
            :key="tune.path"
            :value="tune.path"
            class="text-xs leading-none rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-stone-100"
          >
            <ComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon icon="radix-icons:check" />
            </ComboboxItemIndicator>
            <span>{{ tune.title }}</span>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxRoot>

    <div class="w-3/4 mx-auto mt-10">
      <ABCRenderer v-if="tuneAbc" :abcNotation="tuneAbc" />
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'

const tuneModules = import.meta.glob('~/assets/data/tunes/*.abc', { query: '?raw' })

const tuneList = Object.keys(tuneModules).map((path) => ({
  path,
  title: path
    .split('/')
    .pop()!
    .replace(/\.abc$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase()),
}))

const selectedTunePath = ref<string>(tuneList[0]?.path ?? '')
const tuneAbc = ref<string | null>(null)
const tuneCache = new Map<string, string>()

async function loadTune(path: string) {
  if (!path) return

  const cached = tuneCache.get(path)
  if (cached) {
    tuneAbc.value = cached
    return
  }

  const mod = (await tuneModules[path]()) as { default: string }
  tuneCache.set(path, mod.default)
  tuneAbc.value = mod.default
}

await loadTune(selectedTunePath.value)

watch(selectedTunePath, loadTune)

definePageMeta({
  colorMode: 'light',
})
</script>
