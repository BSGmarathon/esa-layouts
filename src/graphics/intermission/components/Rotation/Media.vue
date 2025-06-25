<script setup lang="ts">
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import { computed, defineEmits, defineProps, onMounted, useTemplateRef } from 'vue';
import { assetsIntermissionSlides } from '@esa-layouts/browser_shared/replicant_store';

const props = defineProps<{
  current: IntermissionSlides['current'],
}>();
const emit = defineEmits<{
  end: [],
}>();
const media = computed(
  () => assetsIntermissionSlides.value.find((a) => a.sum === props.current?.mediaUUID),
);
const player = useTemplateRef<HTMLVideoElement>('VideoPlayer');
const playerSrc = useTemplateRef<HTMLSourceElement>('VideoPlayerSrc');

onMounted(() => {
  // We should always have media, this is just a backup in case.
  if (!media.value) {
    emit('end');
  } else if (!['.mp4', '.webm'].includes(media.value.ext.toLowerCase())) {
    window.setTimeout(() => emit('end'), 20 * 1000);
  } else {
    playerSrc.value!.src = media.value.url;
    playerSrc.value!.type = `video/${media.value.ext.toLowerCase().replace('.', '')}`;
    player.value!.load();
    player.value!.play();
    player.value!.addEventListener('ended', async () => {
      emit('end');
      player.value!.pause();
      playerSrc.value!.removeAttribute('src');
      playerSrc.value!.removeAttribute('type');
      player.value!.load();
    }, { once: true });
  }
});
</script>

<template>
  <div
    v-if="media"
    class="Flex"
  >
    <!-- Image -->
    <img
      v-show="!['.mp4', '.webm'].includes(media.ext.toLowerCase())"
      :src="media.url"
      :style="{
        display: 'block',
        width: '100%',
        height: '100%',
        'object-fit': 'contain',
        position: 'absolute',
      }"
    />

    <!-- Video -->
    <video
      v-show="['.mp4', '.webm'].includes(media.ext.toLowerCase())"
      ref="VideoPlayer"
      muted
      :style="{
        display: 'block',
        width: '100%',
        height: '100%',
        position: 'absolute',
      }"
    >
      <source ref="VideoPlayerSrc"/>
    </video>
  </div>
</template>
