<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import { autorecord, obsData } from '@esa-layouts/browser_shared/replicant_store';

useHead({ title: 'Autorecord settings' });

const isDisabled = computed(() => obsData.data?.transitioning ?? false);

function saveRep() {
  autorecord.save();
}

</script>

<template>
  <v-app>
    <v-switch
      color="red"
      label="Enabled"
      inset
      v-model="autorecord.data!.enabled"
      @change="saveRep"
      :disabled="isDisabled"
    />

    <v-checkbox
      label="Ignore next intermission"
      v-model="autorecord.data!.ignoreNextStop"
      @change="saveRep"
      :disabled="isDisabled"
    />
  </v-app>
</template>

<style scoped lang="scss">
  //
</style>
