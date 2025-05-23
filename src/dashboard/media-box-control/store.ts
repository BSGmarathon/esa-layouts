import clone from 'clone';
import { ref } from 'vue';
import type { MediaBox } from '@esa-layouts/types';
import { defineStore } from 'pinia';
import { mediaBox } from '@esa-layouts/browser_shared/replicant_store';

// eslint-disable-next-line import/prefer-default-export
export const useMediaBoxControlStore = defineStore('mediaBoxControl', () => {
  const newRotation = ref<MediaBox.RotationElem[]>([]);
  const disableSave = ref(false);

  async function save(): Promise<void> {
    disableSave.value = true;

    mediaBox.data!.rotation = clone(newRotation.value);
    mediaBox.save();

    await new Promise((res) => { setTimeout(res, 1000); }); // Fake 1s wait
    disableSave.value = false;
  }

  return {
    newRotation,
    disableSave,
    save,
  };
});
