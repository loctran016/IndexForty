<script setup>
import { parseDateTime, parseDate } from '@internationalized/date'

const props = defineProps({
  strengthExercises: { type: Array, default: () => [] },
  todayDate: { type: String, required: true },
  isDark: { type: Boolean, default: false },
})

const todayCalendarDate = computed(() => parseDate(props.todayDate))

const { setsLoggedOnIso, currentStreak } = useWorkoutStats(
  computed(() => props.strengthExercises),
  computed(() => props.todayDate),
)

const DAILY_GOAL = 15

const todayYear = computed(() => todayCalendarDate.value.year)
const selectedYear = useState('fitness-selected-year', () => todayYear.value)

const availableYears = computed(() => {
  const years = new Set([todayYear.value])
  for (const item of props.strengthExercises) {
    if (item?.date) years.add(parseDateTime(item.date).year)
  }
  return [...years].sort((a, b) => b - a)
})

const yearHeatmapData = computed(() => {
  const data = []
  const year = selectedYear.value
  const start = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year, 11, 31))
  for (let d = start; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = d.toISOString().slice(0, 10)
    data.push([iso, setsLoggedOnIso(iso)])
  }
  return data
})

const maxDailySets = computed(() =>
  Math.max(DAILY_GOAL, ...yearHeatmapData.value.map(([, v]) => v)),
)

function formatIsoDateHeatmap(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const heatmapOption = computed(() => {
  const textColor = props.isDark ? '#e7e5e4' : '#44403c'

  return {
    tooltip: {
      formatter: (params) => `${formatIsoDateHeatmap(params.value[0])}: ${params.value[1]} sets`,
      backgroundColor: props.isDark ? 'rgba(88, 28, 135, 0.75)' : 'rgba(168, 85, 247, 0.85)',
      borderColor: props.isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.3)',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 12, fontWeight: 500 },
      extraCssText:
        'border-radius: 8px; padding: 8px 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);',
    },
    visualMap: {
      min: 0,
      max: maxDailySets.value,
      show: false,
      inRange: { color: ['rgba(168,85,247,0.06)', '#a855f7', '#6b21a8'] },
    },
    calendar: {
      top: 40,
      left: 40,
      right: 20,
      bottom: 20,
      cellSize: ['auto', 16],
      range: String(selectedYear.value),
      firstDay: 1,
      itemStyle: { borderWidth: 3, borderColor: 'transparent', color: 'transparent' },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: { color: textColor },
      dayLabel: { color: textColor, nameMap: ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'] },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: yearHeatmapData.value }],
  }
})
</script>
<template>
  <div class="card">
    <div class="flex items-center justify-between mb-2">
      <h2 class="card-title">
        <div class="i-solar:fire-bold text-xl" />
        Workout calendar
      </h2>
      <ClientOnly>
        <Select
          :model-value="String(selectedYear)"
          @update:model-value="(v) => (selectedYear = Number(v))"
          :options="availableYears.map(String)"
        />
        <template #fallback>
          <div
            class="h-9 w-20 rounded-xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-stone-700/10 animate-pulse"
          />
        </template>
      </ClientOnly>
    </div>
    <div class="overflow-x-auto scrollbar-none">
      <ClientOnly>
        <VChart :option="heatmapOption" autoresize class="h-40 sm:h-50 min-w-144 w-full" />
        <template #fallback>
          <div class="h-50 flex items-center justify-center text-sm opacity-80">Loading…</div>
        </template>
      </ClientOnly>
    </div>
    <p class="text-xs mt-1 opacity-85">Streak: {{ currentStreak }} days · sets logged per day</p>
  </div>
</template>
