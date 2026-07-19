<!-- app/components/AllWorkoutsGrid.vue (new) -->
<script setup>
const props = defineProps({ strengthExercises: { type: Array, default: () => [] } })

const editingRecord = ref(null)
const editDialogOpen = ref(false)

function openEdit(items) {
  editingRecord.value = items
  editDialogOpen.value = true
}
</script>

<template>
  <div class="card">
    <h2 class="card-title">
      <div class="i-tabler:layout-grid" />
      Strength Workouts
      <NuxtLink
        to="/fitness/analytics"
        aria-label="Full Workout Table"
        title="Full Table"
        class="ml-auto"
        target="_blank"
      >
        <div
          class="i-solar:arrow-right-up-line-duotone dark:i-solar:arrow-right-up-bold-duotone text-2xl cursor-pointer"
        />
      </NuxtLink>
    </h2>
    <ul class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch w-full gap-2 mt-4">
      <ExerciseCard
        v-for="items in strengthExercises"
        :key="items.id"
        v-memo="[items.id, items.one_rep_max, items.total_volume]"
        :exercise="items"
        variant="all"
        class="cursor-pointer hover:opacity-90 transition-opacity"
        @click="openEdit(items)"
      />

      <StrengthForm>
        <li
          v-if="strengthExercises.length < 4"
          class="border-stone-100/30 hover:border-stone-100/50 dark:border-stone-100/20 dark:hover:border-white/40 border-1 border-dashed flex items-center justify-center duration-200 w-full border-rounded-md cursor-pointer p-4 min-h-36"
        >
          <div class="i-mdi:plus" />
        </li>
      </StrengthForm>
    </ul>

    <StrengthForm v-model:open="editDialogOpen" :edit-record="editingRecord" />
  </div>
</template>
