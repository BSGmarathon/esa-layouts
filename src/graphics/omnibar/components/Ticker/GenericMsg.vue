<script setup lang="ts">
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { computed, onMounted } from 'vue';

interface GenericMsgProps {
  msg: string;
  seconds: number;
}

const { seconds, msg } = withDefaults(defineProps<GenericMsgProps>(), {
  msg: 'Message?',
  seconds: 25,
});
const emit = defineEmits(['end']);
const lines = computed(() => msg.split('\n').length);

onMounted(async () => {
  await wait(seconds * 1000); // Wait the specified length.
  emit('end');
});
</script>

<template>
  <div
    class="Flex"
    :style="{
      'font-size': lines < 2 ? '33px' : '29px',
      'white-space': 'nowrap',
      'font-weight': 500,
      'text-align': 'center',
      // 'line-height': '100%',
    }"
  >
    <span :style="{ 'white-space': 'pre' }">{{ msg }}</span>
  </div>
</template>
