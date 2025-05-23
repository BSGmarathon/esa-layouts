import { omnibar } from '@esa-layouts/browser_shared/replicant_store';
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { ref } from 'vue';
import { defineStore } from 'pinia';

// eslint-disable-next-line import/prefer-default-export
export const useOmnibarStore = defineStore('omnibar', () => {
  const editItemId = ref('');
  const editDialog = ref(false);
  const localEdits = ref(false);
  const localRotation = ref<Omnibar['rotation']>([]);

  function setLocalRotation(
    { val, manual = false }: { val: Omnibar['rotation'], manual?: boolean },
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
    omnibar.data!.rotation = clone(localRotation.value);
    omnibar.save();
    localEdits.value = false;
  }

  function updateLocalItem(val: Omnibar['rotation'][0]): void {
    const index = localRotation.value.findIndex((r) => r.id === val.id);

    if (index >= 0) {
      localRotation.value[index] = clone(val);
      localEdits.value = true;
    }
  }

  return {
    editItemId,
    editDialog,
    localEdits,
    localRotation,
    setLocalRotation,
    deleteItem,
    storeToGlobalLocation,
    updateLocalItem,
  };
});
