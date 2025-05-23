<script setup lang="ts">
import DOMPurify from 'dompurify';
import markdownit from 'markdown-it';
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';

const toFit = useTemplateRef<HTMLElement>('Fit');
const md = markdownit('commonmark');
const defaultFontSize = 40;
const fontSize = ref(defaultFontSize);
let oldLineCount = -1;

const text = computed(() => {
  const str = mediaBox.data?.rotation.find((a) => a.id === mediaBox.data?.current?.id)?.text ?? '';
  const parsed = md.render(str);

  return DOMPurify.sanitize(parsed);
});

async function fitText() {
  if (!toFit.value) {
    return;
  }

  await nextTick(); // Wait for the renderer to actually change the text.
  fontSize.value = defaultFontSize; // Reset to default.
  let tooBig = toFit.value.scrollHeight > toFit.value.clientHeight;
  let wasTooBig = false;
  while (tooBig) {
    wasTooBig = true;
    fontSize.value -= 1;
    await nextTick(); // eslint-disable-line no-await-in-loop
    tooBig = toFit.value.scrollHeight > toFit.value.clientHeight;
  }
  // Make a few points smaller for good measure.
  if (wasTooBig) {
    fontSize.value -= 5;
  } else {
    fontSize.value -= 3;
  }
  oldLineCount = text.value.split('\n').length;
}

watch(() => text.value, () => {
  if (text.value.split('\n').length !== oldLineCount) {
    fitText();
  }
});

onMounted(() => {
  fitText();
});
</script>

<template>
  <div
    class="CustomText FlexColumn"
    v-html="text"
    ref="Fit"
    :style="{
      'text-align': 'center',
      'font-size': `${fontSize}px`,
      color: 'white',
    }"
  />
</template>

<style scoped>
  .CustomText >>> * {
    margin: 0;
  }
</style>
