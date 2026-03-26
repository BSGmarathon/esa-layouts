<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { autorecord } from '@esa-layouts/browser_shared/replicant_store';

useHead({ title: 'Autorecord settings' });

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
    />

    <v-checkbox
      label="Ignore next intermission"
      v-model="autorecord.data!.ignoreNextStop"
      @change="saveRep"
    />
  </v-app>
</template>

<style scoped>
  //
</style>
