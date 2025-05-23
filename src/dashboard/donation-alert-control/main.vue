<script setup lang="ts">
import { donationAlerts } from '@esa-layouts/browser_shared/replicant_store';
import { v4 as uuid } from 'uuid';
import { useHead } from '@vueuse/head';
import Alert from './components/Alert.vue';

useHead({ title: 'Donation alert control' });

function addBlank(): void {
  donationAlerts.data?.push({
    id: uuid(),
    threshold: 0,
    sound: null,
    volume: 50,
    graphic: null,
    graphicDisplayTime: 5,
  });

  donationAlerts.save();
}
</script>

<template>
  <v-app>
    <v-btn @click="addBlank">Add New Donation Alert Tier</v-btn>
    <div v-if="!donationAlerts.data?.length" class="pa-3 font-italic">
      No donation alert tiers created, add a new one with the button above.
    </div>
    <div v-else :style="{ 'margin-top': '10px' }">
      <Alert v-for="(alert, i) in donationAlerts.data" :key="alert.id" :alert="alert" :index="i" />
    </div>
  </v-app>
</template>
