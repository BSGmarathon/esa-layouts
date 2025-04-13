<script setup lang="ts">
import { donationReaderNew } from '@esa-layouts/browser_shared/replicant_store';
import { DonationReaderNew } from '@esa-layouts/types/schemas';
import { ref, watch } from 'vue';
import { useHead } from '@vueuse/head';

useHead({ title: 'Donation reader control' });

const disable = ref(false);
const entry = ref('Loading...');

function formatDonationReader(val: DonationReaderNew | undefined) {
  const tmp = val?.pronouns ? `${val.name} (${val.pronouns})` : (val?.name || '');

  entry.value = val?.country
    ? `${tmp} (${val.country})`
    : tmp;
}

watch(() => donationReaderNew.data, formatDonationReader, { immediate: true, deep: true });

async function modify(clear = false): Promise<void> {
  disable.value = true;

  try {
    await nodecg.sendMessage('readerModify', clear ? null : entry.value);
  } catch (err) {
    // catch
  }

  // TODO: is this needed?
  formatDonationReader(donationReaderNew.data);
  disable.value = false;
}
</script>

<template>
  <v-app>
    <div class="d-flex">
      <v-text-field
        v-model="entry"
        label="Donation Reader"
        hide-details
        filled
        :spellcheck="false"
        :disabled="disable"
        @keyup.enter="modify(); $event.target.blur();"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="disable"
        @click="modify()"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      :disabled="disable"
      @click="modify(true)"
    >
      Clear
    </v-btn>
  </v-app>
</template>
