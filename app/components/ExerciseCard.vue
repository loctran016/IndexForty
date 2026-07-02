<template>
  <li
    class="duration-200 w-full border-rounded-md cursor-pointer p-4 group"
    :class="cardClass"
  >
    <h3 class="font-bold flex items-center gap-2 font-sans text-base">
      <div class="i-mdi:dumbbell" />
      {{ exercise.exercise }}
    </h3>

    <div class="text-sm mt-2 flex gap-1">
      <div
        class="text-base rounded-sm my-auto w-3 aspect-square inline-block self-center"
        :class="dayToColor[(getDayOfWeek(parseDateTime(exercise.date), 'en-GB') + 6) % 7]"
      />
      {{ df.format(parseDateTime(exercise.date).toDate('Asia/Ho_Chi_Minh')) }}
    </div>
<div class="flex justify-between">
    <div
      class="mt-4 text-sm font-bold"
      :class="
        EXERCISE_TO_SPLIT[exercise.exercise] === 'Pull' ? 'text-purple-600 dark:text-purple-300' : 'text-pink-600 dark:text-pink-300'
      "
    >
      {{ EXERCISE_TO_SPLIT[exercise.exercise].toUpperCase() }}
    </div>
    <!-- <div v-if="showDate" class="text-sm mt-2 flex gap-1">
      <div
        v-if="showDayColor"
        class="text-base rounded-sm my-auto w-3 aspect-square inline-block self-center"
        :class="dayToColor[(getDayOfWeek(parseDateTime(exercise.date), 'en-GB') + 6) % 7]"
      />
      {{ df.format(parseDateTime(exercise.date).toDate('Asia/Ho_Chi_Minh')) }}
    </div>

    <div v-else class="text-sm mt-1">
      {{ df.format(parseDateTime(exercise.date).toDate('Asia/Ho_Chi_Minh')) }}
    </div> -->

    <ul class="flex flex-wrap items-left gap-1 text-xs mt-1">
      <li
        v-for="muscle in exercise.muscles"
        :key="`${exercise.id}-${muscle}`"
        class="w-max rounded-lg px-2 py-1 transition-all duration-200"
        :class="muscleClass"
      >
        {{ muscle }}
      </li>
    </ul></div>
  </li>
</template>

<script setup lang="ts">
import { DateFormatter, getDayOfWeek, parseDateTime } from '@internationalized/date'
import { type StrengthRecord, EXERCISE_TO_SPLIT } from '~/types/database.types'

const props = withDefaults(
  defineProps<{
    exercise: StrengthRecord
    variant?: 'today' | 'all'
  }>(),
  {
    variant: 'all',
  },
)

const df = new DateFormatter('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const dayToColor = [
  'bg-amber-400/50',
  'bg-emerald-400/50',
  'bg-sky-400/50',
  'bg-indigo-400/50',
  'bg-purple-400/50',
  'bg-rose-400/50',
  'bg-teal-400/50',
]

const showDate = true
const showDayColor = props.variant === 'all'
const cardClass =
  props.variant === 'all'
    ? 'bg-stone-300/30 hover:bg-stone-500/30 dark:bg-stone-700/30 dark:hover:bg-stone-500/30'
    : 'bg-stone-300/30 hover:bg-stone-500/30 dark:bg-stone-700/30 dark:hover:bg-stone-500/30'
const muscleClass =
  props.variant === 'all'
    ? 'bg-purple-600/20 hover:bg-purple-400/50 dark:bg-purple-400/10 dark:hover:bg-purple-400/50'
    : 'bg-purple-400/10 hover:bg-purple-400/50'
</script>

<style></style>
