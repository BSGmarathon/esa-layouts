import type { VideoPlayer } from '@esa-layouts/types/schemas';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { videoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import clone from 'clone';

let localEditTimeout: number | undefined;

// eslint-disable-next-line import/prefer-default-export
export const useIntermissionPlayerStore = defineStore('intermissionPlayer', () => {
  const disableSave = ref(false);
  const localEdits = ref(false);
  const newPlaylist = ref<VideoPlayer['playlist']>([]);

  function resetLocalPlaylist() {
    newPlaylist.value = videoPlayer.data?.playlist ?? [];
    localEdits.value = false;
  }

  function onLocalEdits() {
    localEdits.value = true;

    clearTimeout(localEditTimeout);

    // Reset the playlist after 30 seconds
    // we're using the window accessor here because of typescript BS
    localEditTimeout = window.setTimeout(() => {
      resetLocalPlaylist();
    }, 30 * 1000);
  }

  function playlistAdd({ sum, commercial }: { sum?: string, commercial?: boolean }) {
    newPlaylist.value.push({
      sum,
      length: 0,
      commercial: commercial ?? true,
    });

    onLocalEdits();
  }

  async function save() {
    if (!videoPlayer.data) {
      return;
    }

    disableSave.value = true;

    videoPlayer.data.playlist = clone(newPlaylist.value);
    videoPlayer.save();

    await new Promise((res) => { setTimeout(res, 1000); }); // Fake 1s wait

    disableSave.value = false;
    clearTimeout(localEditTimeout);
    localEdits.value = false;
  }

  return {
    disableSave,
    localEdits,
    newPlaylist,
    save,
    playlistAdd,
    onLocalEdits,
    resetLocalPlaylist,
  };
});
