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
            class="fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 card shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-10"
          >
            <Motion
              :initial="false"
              :animate="{ opacity: 1, top: '50%' }"
              :exit="{ opacity: 0, top: '30%' }"
            >
              <DialogTitle class="font-semibold font-head text-lg mb-5 leading-normal dark:text-gray-100">
                Strength Exercise
              </DialogTitle>

              <form class="space-y-4" @submit.prevent="onSubmit">
                <div>
                  <label class="mb-1 block text-sm font-medium">Exercise</label>
                  <ExerciseComboBox v-model="form.exercise" />
                  <p v-if="r$.exercise.$error" class="text-sm text-red-600 dark:text-red-400 mt-1">
                    {{ r$.exercise.$errors[0] }}
                  </p>
                </div>

                <div>
                  <label class="mb-1 block text-sm font-medium">Sets</label>
                  <div class="space-y-2">
                    <div
                      v-for="(set, index) in form.sets"
                      :key="r$.sets.$each[index]?.$id ?? index"
                      class="space-y-1"
                    >
                      <div class="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-2">
                        <input
                          v-model.number="set.reps"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="reps"
                          class="w-full focus:outline-none border-b-gray-500/30 dark:border-b-gray-100/50 focus:border-purple-600 transition-all duration-200 border px-3 py-2 border-0 border-b-2"
                        />
                        <span class="text-sm">reps x</span>
                        <input
                          v-model.number="set.kg"
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="kg"
                          class="w-full focus:outline-none focus:border-purple-600 border-b-gray-500/30 dark:border-b-gray-100/50 transition-all duration-200 border px-3 py-2 border-0 border-b-2"
                        />
                        <span class="text-sm">kg</span>
                        <button
                          v-if="form.sets.length > 2"
                          type="button"
                          class="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                          aria-label="Remove set"
                          @click="removeSet(index)"
                        >
                          ✕
                        </button>
                      </div>

                      <p
                        v-if="r$.sets.$each[index]?.reps.$error"
                        class="text-xs text-red-600 dark:text-red-400"
                      >
                        {{ r$.sets.$each[index].reps.$errors[0] }}
                      </p>
                      <p
                        v-if="r$.sets.$each[index]?.kg.$error"
                        class="text-xs text-red-600 dark:text-red-400"
                      >
                        {{ r$.sets.$each[index].kg.$errors[0] }}
                      </p>
                    </div>

                    <button
                      type="button"
                      class="text-sm text-purple-600 hover:underline"
                      @click="addSet"
                    >
                      + Add set
                    </button>

                    <p v-if="r$.sets.$self.$error" class="text-xs text-red-600 dark:text-red-400">
                      {{ r$.sets.$self.$errors[0] }}
                    </p>
                  </div>
                </div>

                <p v-if="errorMsg" class="text-sm text-red-600 dark:text-red-400 bg-red-950/60">
                  {{ errorMsg }}
                </p>
                <p v-if="successMsg" class="text-sm text-emerald-600 dark:text-emerald-400">
                  {{ successMsg }}
                </p>

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
import { useRegle } from '@regle/core'
import { required, requiredIf, numeric, minValue, minLength, withMessage } from '@regle/rules'
import { EXERCISE_TO_MUSCLES, type StrengthExercise, type Database } from '~/types/database.types'

const supabase = useSupabaseClient()

const open = ref(false)

interface SetInput {
  reps: number | null
  kg: number | null
}

const form = ref<{ exercise: StrengthExercise | null; sets: SetInput[] }>({
  exercise: null,
  sets: [
    { reps: null, kg: null },
    { reps: null, kg: null },
  ],
})

const { r$ } = useRegle(form, {
  exercise: {
    required: withMessage(required, 'Please select an exercise.'),
  },
  sets: {
    minLength: withMessage(minLength(2), 'Add at least two sets with reps and weight.'),
    atLeastTwoComplete: withMessage(
      (value: SetInput[]) => value.filter((s) => s.reps != null && s.kg != null).length >= 2,
      'Add at least two complete sets (reps and kg).',
    ),
    $each: (item) => ({
      reps: {
        requiredIf: withMessage(
          requiredIf(() => item.value.kg != null),
          'Enter reps for this set.',
        ),
        numeric,
        minValue: minValue(1),
      },
      kg: {
        requiredIf: withMessage(
          requiredIf(() => item.value.reps != null),
          'Enter weight for this set.',
        ),
        numeric,
        minValue: minValue(0),
      },
    }),
  },
})

const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

function addSet() {
  form.value.sets.push({ reps: null, kg: null })
}

function removeSet(index: number) {
  form.value.sets.splice(index, 1)
}

function resetForm() {
  form.value.exercise = null
  form.value.sets = [{ reps: null, kg: null }]
  r$.$reset({ toInitialState: true })
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

  const { valid, data } = await r$.$validate()
  if (!valid) return

  loading.value = true
  try {
    const exerciseKey = data.exercise as StrengthExercise
    const muscles = EXERCISE_TO_MUSCLES[exerciseKey] ?? []

    // Drop any incomplete trailing row before saving (shouldn't exist if valid, but be safe)
    const parsedSets: number[][] = data.sets
      .filter((s) => s.reps != null && s.kg != null)
      .map((s) => [s.reps as number, s.kg as number])

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
