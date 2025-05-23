import { intermissionSlides } from '@esa-layouts/browser_shared/replicant_store';
import { IntermissionSlides } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { ref } from 'vue';
import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useIntermissionSlideStore = defineStore('intermissionSlides', () => {
  const localEdits = ref(false);
  const localRotation = ref<IntermissionSlides['rotation']>([]);

  function setLocalRotation(
    { val, manual = false }: { val: IntermissionSlides['rotation'], manual?: boolean },
  ): void {
    localRotation.value = clone(val);
    localEdits.value = manual;
  }

  function deleteItem(id: string): void {
    const index = localRotation.value.findIndex((r) => r.id === id);

    if (index > -1) {
      localRotation.value.splice(index, 1);
      localEdits.value = true;
    }
  }

  function storeToGlobalLocation(): void {
    intermissionSlides.data!.rotation = clone(localRotation.value);
    intermissionSlides.save();
    localEdits.value = false;
  }

  return {
    localEdits,
    localRotation,
    setLocalRotation,
    deleteItem,
    storeToGlobalLocation,
  };
});
