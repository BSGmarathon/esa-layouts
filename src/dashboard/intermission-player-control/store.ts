import type { VideoPlayer } from '@esa-layouts/types/schemas';
import { ref } from 'vue';
import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useIntermissionPlayerStore = defineStore('intermissionPlayer', () => {
  const disableSave = ref(false);
  const localEdits = ref(false);
  const newPlaylist = ref<VideoPlayer['playlist']>([]);

  function playlistAdd({ sum, commercial }: { sum?: string, commercial?: boolean }) {
    newPlaylist.value.push({
      sum,
      length: 0,
      commercial: commercial ?? true,
    });
  }

  return {
    disableSave,
    localEdits,
    newPlaylist,
    playlistAdd,
  };
});
