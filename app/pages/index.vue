<script setup lang="ts">
import type { CalendarRootProps } from 'reka-ui'
// import { Icon } from '@iconify/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui'

const date = today(getLocalTimeZone())

const isDateUnavailable: CalendarRootProps['isDateUnavailable'] = (date) => {
  return date.day === 317
}

const selectedDate = ref()
</script>

<template>
  <div class="min-h-screen">
    <div
      class="grid lg:grid-cols-6 gap-4 max-w-9/10 lg:max-w-4/5 px-4 pt-20 py-4 mx-auto font-sans dark:text-gray-100"
    >
      <CalendarRoot
        v-slot="{ weekDays, grid }"
        :is-date-unavailable="isDateUnavailable"
        :default-value="date"
        class="rounded-xl lg:order-first text-lg lg:col-span-3 bg-white/50 dark:bg-stone-500/50 border-stone-800/30 p-8 shadow-sm border dark:border-stone-300/30"
        fixed-weeks
        weekdayFormat="short"
        :week-starts-on="1"
        :model-value="selectedDate"
      >
        <CalendarHeader class="flex items-center justify-between">
          <CalendarPrev
            class="inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent p-2 text-2xl hover:-translate-x-1 transition-all duration-200 hover:text-purple-600 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <div class="i-mdi:arrow-left" />
          </CalendarPrev>
          <CalendarHeading class="font-medium" />

          <CalendarNext
            class="inline-flex items-center cursor-pointer justify-center rounded-md bg-transparent p-2 text-2xl hover:translate-x-1 transition-all duration-200 hover:text-purple-600 active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <div class="i-mdi:arrow-right" />
          </CalendarNext>
        </CalendarHeader>
        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <CalendarGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse select-none space-y-1"
          >
            <CalendarGridHead>
              <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                <CalendarHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="rounded-md text-base text-center text-stone-900 dark:text-stone-100"
                >
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody class="grid">
              <CalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="grid grid-cols-7 justify-items-center"
              >
                <CalendarCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative text-center text-base"
                >
                  <CalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal w-10 h-10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[outside-view]:text-stone-900/30 dark:data-[outside-view]:text-stone-50/30 data-[selected]:bg-purple-400/40 data-[selected]:text-purple-700 dark:data-[selected]:bg-purple-500/30 dark:data-[selected]:text-purple-300 data-[selected]:font-bold hover:bg-purple-700/20 dark:hover:bg-purple-400/20 data-[highlighted]:bg-purple-700/20 data-[unavailable]:pointer-events-none data-[unavailable]:text-stone-800/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-purple-400/50 cursor-pointer"
                  />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </div>
      </CalendarRoot>
    </div>
  </div>
  {{ selectedDate }}
</template>
