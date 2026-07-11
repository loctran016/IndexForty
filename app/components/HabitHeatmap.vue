<script setup lang="ts">
import { today } from '@internationalized/date'

const props = defineProps<{
  logsByDate: Record<string, number> // iso date -> count (0, 1, or 2 for skincare)
  maxValue: number // 1 for walk/pennywort, 2 for skincare
  color: string
  isDark: boolean
}>()

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

const rangeStart = computed(() => today(TIME_ZONE).subtract({ months: 2 }))
const rangeEnd = computed(() => today(TIME_ZONE).add({ months: 2 }))

const heatmapData = computed(() => {
  const data: [string, number][] = []
  let cursor = rangeStart.value
  while (cursor.compare(rangeEnd.value) <= 0) {
    const iso = `${cursor.year}-${pad(cursor.month)}-${pad(cursor.day)}`
    data.push([iso, props.logsByDate[iso] ?? 0])
    cursor = cursor.add({ days: 1 })
  }
  return data
})

function formatIsoDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const chartOption = computed(() => {
  const textColor = props.isDark ? '#e7e5e4' : '#44403c'
  const startIso = `${rangeStart.value.year}-${pad(rangeStart.value.month)}-${pad(rangeStart.value.day)}`
  const endIso = `${rangeEnd.value.year}-${pad(rangeEnd.value.month)}-${pad(rangeEnd.value.day)}`

  return {
    tooltip: {
      formatter: (params: any) =>
        `${formatIsoDate(params.value[0])}: ${params.value[1]}/${props.maxValue}`,
    },
    visualMap: {
      min: 0,
      max: props.maxValue,
      show: false,
      inRange: { color: ['rgba(0,0,0,0.04)', props.color] },
    },
    calendar: {
      top: 20,
      left: 30,
      right: 10,
      bottom: 10,
      cellSize: ['auto', 14],
      range: [startIso, endIso],
      firstDay: 1,
      itemStyle: { borderWidth: 2, borderColor: 'transparent' },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: { color: textColor, fontSize: 10 },
      dayLabel: { color: textColor, fontSize: 10, nameMap: ['Mon', '', 'Wed', '', 'Fri', '', ''] },
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data: heatmapData.value }],
  }
})
</script>

<template>
  <ClientOnly>
    <VChart :option="chartOption" autoresize class="h-32 w-full" />
    <template #fallback>
      <div class="h-32 flex items-center justify-center text-sm opacity-50">Loading…</div>
    </template>
  </ClientOnly>
</template>
