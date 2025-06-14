import type { FullScreenVideoPlayer } from '@esa-layouts/types/schemas';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fullScreenVideoPlayer } from '@esa-layouts/browser_shared/replicant_store';
import clone from 'clone';

let localEditTimeout: number | undefined;

// eslint-disable-next-line import/prefer-default-export
export const useVideoPlayerStore = defineStore('videoPlayer', () => {
  const disableSave = ref(false);
  const localEdits = ref(false);
  const newPlaylist = ref<FullScreenVideoPlayer['playlist']>([]);
  const newFinishScene = ref<FullScreenVideoPlayer['finishScene']>('intermission');

  function resetLocalPlaylist() {
    newPlaylist.value = fullScreenVideoPlayer.data?.playlist ?? [];
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

  function playlistAdd(sum: string) {
    newPlaylist.value.push(sum);

    onLocalEdits();
  }

  function setFinishScene(finishScene: FullScreenVideoPlayer['finishScene']) {
    newFinishScene.value = finishScene;
    onLocalEdits();
  }

  async function save() {
    if (!fullScreenVideoPlayer.data) {
      return;
    }

    disableSave.value = true;

    fullScreenVideoPlayer.data.playlist = clone(newPlaylist.value);
    fullScreenVideoPlayer.data.finishScene = newFinishScene.value;
    fullScreenVideoPlayer.save();

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
