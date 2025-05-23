<script setup lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { onMounted } from 'vue';

interface CrowdControlProps {
  msg: string;
  seconds: number;
}

const props = withDefaults(defineProps<CrowdControlProps>(), {
  msg: 'Message?',
  seconds: 25,
});
const emit = defineEmits(['end']);

onMounted(async () => {
  await wait(props.seconds * 1000); // Wait the specified length.
  emit('end');
});
</script>

<template>
  <div
    class="Flex Alert"
    :style="{
      padding: '0 17px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '25px' }">
      <img
        src="../img/CrowdControl.png"
        :style="{
          height: '1.2em',
          margin: '0 .05em 0 .1em',
          'vertical-align': '-0.25em',
        }"
      >
      Crowd Control
    </div>
    <div
      :style="{
        'font-size': '23px',
        'white-space': 'nowrap',
        'overflow': 'hidden',
      }"
    >
      {{ msg }}
    </div>
  </div>
</template>
