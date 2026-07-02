<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <ClientOnly>
      <DialogPortal>
        <AnimatePresence multiple>
          <DialogOverlay
            as-child
            class="bg-transparent backdrop-blur-md backdrop-brightness-80 w-screen h-screen fixed inset-0 z-5"
          >
            <Motion :initial="false" :animate="{ opacity: 1 }" :exit="{ opacity: 0, scale: 0.6 }" />
          </DialogOverlay>

          <DialogContent
            as-child
            class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-stone-50 dark:bg-stone-700 dark:text-gray-100 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-10"
          >
            <Motion
              :initial="false"
              :animate="{ opacity: 1, top: '50%' }"
              :exit="{ opacity: 0, top: '30%' }"
            >
              <DialogTitle class="font-semibold mb-5 leading-normal dark:text-gray-100">
                Strength Exercise
              </DialogTitle>

              <form class="space-y-4" @submit.prevent="onSubmit">
                <div>
                  <label class="mb-1 block text-sm font-medium">Exercise</label>
                  <ExerciseComboBox v-model="exercise" />
                </div>

                <div>
                  <label class="mb-1 block text-sm font-medium">Sets</label>
                  <div class="space-y-2">
                    <div class="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                      <input
                        v-model.number="reps1"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="reps"
                        class="w-full focus:outline-none border-b-gray-500/30 dark:border-b-gray-100/50 focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2"
                      />
                      <span class="text-sm">reps x</span>
                      <input
                        v-model.number="kg1"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        class="w-full focus:outline-none focus:border-purple-600 border-b-gray-500/30 dark:border-b-gray-100/50 transition-all duration-200 border px-3 py-2 border-0 border-b-2"
                      />
                      <span class="text-sm">kg</span>
                    </div>

                    <div class="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                      <input
                        v-model.number="reps2"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="reps"
                        class="w-full focus:outline-none focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2 border-b-gray-500/30 dark:border-b-gray-100/50"
                      />
                      <span class="text-sm">reps x</span>
                      <input
                        v-model.number="kg2"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        class="w-full focus:outline-none focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2 border-b-gray-500/30 dark:border-b-gray-100/50"
                      />
                      <span class="text-sm">kg</span>
                    </div>

                    <div class="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2">
                      <input
                        v-model.number="reps3"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="reps"
                        class="w-full focus:outline-none focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2 border-b-gray-500/30 dark:border-b-gray-100/50"
                      />
                      <span class="text-sm">reps x</span>
                      <input
                        v-model.number="kg3"
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="kg"
                        class="w-full focus:outline-none focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2 border-b-gray-500/30 dark:border-b-gray-100/50"
                      />
                      <span class="text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <p v-if="errorMsg" class="text-sm text-red-600">{{ errorMsg }}</p>
                <p v-if="successMsg" class="text-sm text-emerald-600">{{ successMsg }}</p>

                <button
                  type="submit"
                  :disabled="loading"
                  class="flex ml-auto px-3 py-3 mt-6 hover:scale-101 hover:-translate-y-0.5 hover:shadow-lg items-center justify-center border-1 border-stone-700/90 dark:border-stone-100/50 hover:dark:border-stone-100/80 transition-all duration-200 rounded-md px-[15px] leading-none focus:shadow-[0_0_0_2px] focus:outline-none cursor-pointer disabled:opacity-60"
                >
                  {{ loading ? 'Saving...' : 'Save workout' }}
                </button>
              </form>

              <DialogClose
                class="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
                as-child
              >
                <!-- <button type="button" class="i-mdi:close" /> -->
              </DialogClose>
            </Motion>
          </DialogContent>
        </AnimatePresence>
      </DialogPortal>

      <template #fallback />
    </ClientOnly>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'
import { AnimatePresence, Motion } from 'motion-v'
import { ref, watch } from 'vue'
import { EXERCISE_TO_MUSCLES, type StrengthExercise, type Database } from '~/types/database.types'

const supabase = useSupabaseClient()

const open = ref(false)
const exercise = ref<StrengthExercise | null>(null)
const setsInput = ref<number[][]>([])

const reps1 = ref<number | null>(null)
const kg1 = ref<number | null>(null)
const reps2 = ref<number | null>(null)
const kg2 = ref<number | null>(null)
const reps3 = ref<number | null>(null)
const kg3 = ref<number | null>(null)

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

function buildSetsFromInputs(): number[][] {
  const pairs: Array<[number | null, number | null]> = [
    [reps1.value, kg1.value],
    [reps2.value, kg2.value],
    [reps3.value, kg3.value],
  ]

  const built: number[][] = []
  for (const [reps, kg] of pairs) {
    const bothEmpty = (reps == null || Number.isNaN(reps)) && (kg == null || Number.isNaN(kg))
    if (bothEmpty) continue
    if (reps == null || Number.isNaN(reps) || kg == null || Number.isNaN(kg)) continue
    built.push([reps, kg])
  }
  return built
}

function resetForm() {
  exercise.value = null
  setsInput.value = []
  reps1.value = null
  kg1.value = null
  reps2.value = null
  kg2.value = null
  reps3.value = null
  kg3.value = null
}

watch(open, (v) => {
  if (v) {
    errorMsg.value = ''
    successMsg.value = ''
  }
})

async function onSubmit() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!exercise.value) {
    errorMsg.value = 'Please select an exercise.'
    return
  }

  const parsedSets = buildSetsFromInputs()
  setsInput.value = parsedSets

  loading.value = true
  try {
    const exerciseKey = exercise.value as StrengthExercise
    const muscles = EXERCISE_TO_MUSCLES[exerciseKey] ?? []

    const { error } = await supabase
      .from<Database['public']['Tables']['strength']['Insert']>('strength')
      .insert({
        exercise: exerciseKey,
        sets: parsedSets,
        muscles: [...muscles],
      })

    if (error) throw error

    successMsg.value = 'Workout saved.'
    resetForm()
    open.value = false
  } catch (e: any) {
    errorMsg.value = e?.message ?? 'Failed to save workout.'
  } finally {
    loading.value = false
  }
}
</script>
