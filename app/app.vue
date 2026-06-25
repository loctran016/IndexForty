<script setup>
import { ref, onMounted } from "vue";
import { createClient } from "@supabase/supabase-js";
import "@unocss/reset/normalize.css";

const config = useRuntimeConfig();
const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey,
);

const strengthExcercises = ref([]);

async function getTodos() {
  const { data } = await supabase.from("strength").select();
  strengthExcercises.value = data;
}

onMounted(() => {
  getTodos();
});
</script>

<template>
  <ul>
    <li v-for="items in strengthExcercises" :key="items.id">
      {{ items.created_at }}
      {{ items.excercise }}
      {{ items.type }}
      {{ items.created_at }}
      {{ items.created_at }}
    </li>
  </ul>
</template>
