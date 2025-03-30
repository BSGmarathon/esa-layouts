<script setup lang="ts">
import { onMounted } from 'vue';

const emit = defineEmits<{ end: [] }>();

onMounted(() => {
  emit('end');
});
</script>

<template>
  <div
    ref="MiniCredits"
    class="Flex Alert MiniCredits"
    :style="{
      padding: '0 17px',
      height: '100%',
      'flex-direction': 'column',
      'align-items': 'flex-start',
      'overflow': 'hidden',
    }"
  >
    Minicredits not yet implemented in vue 3.
  </div>
</template>

<style scoped>
  .Msg > span + span::before {
    content: '';
    margin: 0 10px 0 7px;
  }

  .Title {
    font-weight: 600;
  }
</style>
