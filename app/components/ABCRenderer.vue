

<template>
  <div>
    <!-- The container where abcjs will inject the sheet music -->
    <div ref="sheetMusic" class=""></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  abcNotation: {
    type: String,
    required: true
  }
});

const sheetMusic = ref(null);

onMounted(async () => {
  // Import abcjs only on the client side to avoid SSR errors
  const abcjs = await import('abcjs');

  // Render the music into the DOM ref
  if (sheetMusic.value) {
    abcjs.renderAbc(sheetMusic.value, props.abcNotation, {
        responsive: 'resize',
      selectionColor: 'oklch(71.4% 0.203 305.504)'
    //   selectionColor: 'oklch(55.8% 0.288 302.321)'
    });
  }
});
</script>
