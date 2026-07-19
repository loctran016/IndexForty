import { parseDateTime, parseDate } from '@internationalized/date'

export function useWorkoutStats(strengthExercises, todayDate) {
  const todayCalendarDate = computed(() => parseDate(unref(todayDate)))

  const setsPerDayMap = computed(() => {
    const map = new Map()
    for (const item of unref(strengthExercises) ?? []) {
      if (!item?.date) continue
      const d = parseDateTime(item.date)
      const iso = `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`
      map.set(iso, (map.get(iso) ?? 0) + (item.sets?.length ?? 0))
    }
    return map
  })

  function setsLoggedOnIso(iso) {
    return setsPerDayMap.value.get(iso) ?? 0
  }

  function setsLoggedOn(calDate) {
    const iso = `${calDate.year}-${String(calDate.month).padStart(2, '0')}-${String(calDate.day).padStart(2, '0')}`
    return setsLoggedOnIso(iso)
  }

  const currentStreak = computed(() => {
    let streak = 0
    let cursor = todayCalendarDate.value
    if (setsLoggedOn(cursor) === 0) cursor = cursor.subtract({ days: 1 })
    while (setsLoggedOn(cursor) > 0) {
      streak++
      cursor = cursor.subtract({ days: 1 })
    }
    return streak
  })

  return { todayCalendarDate, setsPerDayMap, setsLoggedOnIso, setsLoggedOn, currentStreak }
}
