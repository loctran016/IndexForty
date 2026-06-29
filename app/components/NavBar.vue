<template>
  <ul
    class="fixed left-1/2 -translate-x-1/2 border-rounded-full bg-gray-800/10 border-gray-400/10 dark:bg-gray-300/10 dark:border-gray-100/10 w-max  flex gap-3 items-center justify-center top-4 z-100 border-1 backdrop-blur-2xl transition-all duration-300 scale-90 -translate-y-1 hover:translate-y-0 hover:scale-100 backdrop-blur-md -backdrop-brightness-10"

  >
    <li>
      <NuxtLink to="/">
        <IconNavBarWrapper>
          <div class="i-mdi:home" />
        </IconNavBarWrapper>
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/fitness-tracker">
        <IconNavBarWrapper>
          <div class="i-mdi:weight-lifter" /> </IconNavBarWrapper
      ></NuxtLink>
    </li>
    <li>
      <NuxtLink to="/musical"
        ><IconNavBarWrapper>
          <div class="i-mdi:music-clef-treble" /> </IconNavBarWrapper
      ></NuxtLink>
    </li>
    <!-- <li>
      <NuxtLink to="/cooking"
        ><IconNavBarWrapper><div class="i-mdi:pot-steam" /></IconNavBarWrapper
      ></NuxtLink>
    </li> -->
    <li>
      <NuxtLink to="/gallery"
        ><IconNavBarWrapper><div class="i-solar:gallery-round-bold" /></IconNavBarWrapper
      ></NuxtLink>
    </li>
    <li class=" ">
        <button class="cursor-pointer duration-200 border-rounded-full text-lg lg:text-xl p-3 flex items-center justify-center" v-if="$colorMode.value === 'system'" @click="$colorMode.preference = 'dark'"><div class="i-tabler:device-laptop" /></button>
        <button class="cursor-pointer hover:bg-stone-100/10 hover:text-white duration-200 transition-all duration-200 border-rounded-full text-lg lg:text-xl p-3 flex items-center justify-center" v-else-if="$colorMode.value === 'dark'" @click="$colorMode.preference = 'light'"><div class="i-mdi:weather-night" /></button>
        <button class="cursor-pointer duration-200 hover:bg-orange-100/50 hover:text-orange-400 border-rounded-full text-lg lg:text-xl p-3 flex items-center justify-center" v-else="$colorMode.value === 'light'" @click="$colorMode.preference = 'system'"><div class="i-mdi:white-balance-sunny" /></button>


    </li>
  </ul>
</template>

<script setup>
</script>
