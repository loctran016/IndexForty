<template>
  <ComboboxRoot
    v-model="values"
    multiple
    ignore-filter
    class="my-4 mx-auto relative"
  >
    <ComboboxAnchor class="w-[400px] inline-flex items-center justify-between rounded-lg p-2 text-[13px] leading-none  gap-[5px] shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-grass9 outline-none">
      <TagsInputRoot
        v-model="values"
        delimiter=""
        class="flex gap-2 items-center rounded-lg flex-wrap"
      >
        <TagsInputItem
          v-for="item in values"
          :key="item"
          :value="item"
          class="flex items-center justify-center gap-2  bg-grass8 aria-[current=true]:bg-grass9 rounded px-2 py-1"
        >
          <TagsInputItemText class="text-sm" />
          <TagsInputItemDelete>
            <div class="i-tabler:x" />
          </TagsInputItemDelete>
        </TagsInputItem>

        <ComboboxInput
          v-model="query"
          as-child
        >
          <TagsInputInput
            placeholder="Muscles"
            class="focus:outline-none flex-1 rounded !bg-transparent  placeholder:text-mauve10 px-1"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInputRoot>

      <ComboboxTrigger>
        <Icon
          icon="radix-icons:chevron-down"
          class="h-4 w-4 text-grass11"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent class="absolute z-10 w-full mt-2 overflow-hidden rounded shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
      <ComboboxViewport class="p-[5px]">
        <ComboboxGroup v-if="filteredOptions.length" class="h-20 lg:h-40 overflow-y-scroll">

          <ComboboxItem
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="text-xs leading-none text-grass11 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-grass8 data-[highlighted]:text-grass1"
            :value="option"
          >
            <ComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Icon icon="radix-icons:check" />
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ComboboxAnchor, ComboboxContent, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxItemIndicator, ComboboxRoot, ComboboxTrigger, ComboboxViewport, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText, TagsInputRoot, useFilter } from 'reka-ui'
import type { Muscles } from '~/types/database.types'

const props = defineProps<{ modelValue?: Muscles[] }>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Muscles[]): void
}>()

const values = ref<Muscles[]>(props.modelValue ?? [])
watch(() => props.modelValue, (v) => { values.value = v ?? [] }, { immediate: true })

const { contains } = useFilter({ sensitivity: 'base' })
const query = ref('')
const options: Muscles[] = [
  'Upper chest',
  'Middle chest',
  'Lower chest',
  'Front delts',
  'Side delts',
  'Rear delts',
  'Abs',
  'Lats',
  'Traps',
  'Lower back',
  'Forearm',
  'Triceps',
  'Biceps',
]
const filteredOptions = computed(() => options.filter(option => contains(option, query.value) && !values.value.includes(option)))

watch(values, () => { query.value = '' }, { deep: true })
watch(values, (v) => emit('update:modelValue', v), { deep: true })
</script>

<style scoped></style>
