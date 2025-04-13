<script setup lang="ts">
import { assetsDonationAlertAssets as assets, donationAlerts } from '@esa-layouts/browser_shared/replicant_store';
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { DonationAlerts } from '@esa-layouts/types/schemas';
import { ref } from 'vue';
import clone from 'clone';

interface AlertProps {
  alert: DonationAlerts[0];
  index: number;
}

const props = defineProps<AlertProps>();

const dialog = ref(false);
const thresholdEdit = ref('0');
const soundEdit = ref('');
const volumeEdit = ref('0');
const isFormValid = ref(false);

function isRequired(val: string): boolean | string {
  return !!val || 'Required';
}

function isNumber(val: string): boolean | string {
  return !Number.isNaN(Number(val)) || 'Must be a number';
}

function isZeroOrBigger(val: string): boolean | string {
  const num = Number(val);
  return (num >= 0) || 'Must be equal to or bigger than 0';
}

function isZeroOrSmaller(val: string): boolean | string {
  const num = Number(val);
  return (num <= 0) || 'Must be equal to or smaller than 0';
}

function isValidAsset(val: string): boolean | string {
  const soundAsset = assets.value.find((v) => v.name === val);
  return !!soundAsset || 'Asset name must match a file uploaded';
}

function test(): void {
  nodecg.sendMessage('omnibarPlaySound', { amount: props.alert.threshold });
}

function edit(): void {
  dialog.value = true;
  thresholdEdit.value = props.alert.threshold.toString() ?? '0';
  soundEdit.value = props.alert.sound ?? '';
  volumeEdit.value = props.alert.volume.toString() ?? '0';
}

function save(): void {
  if (!donationAlerts.data) {
    return;
  }

  const item: DonationAlerts[0] = {
    id: props.alert.id,
    threshold: Number(thresholdEdit.value),
    sound: soundEdit.value,
    volume: Number(volumeEdit.value),
    graphic: props.alert.graphic, // TODO
    graphicDisplayTime: props.alert.graphicDisplayTime, // TODO
  };

  const foundIndex = donationAlerts.data.findIndex((i) => i.id === item.id);

  if (foundIndex > -1) {
    donationAlerts.data[foundIndex] = clone(item);
    donationAlerts.save();
  }

  dialog.value = false;
}

function remove(): void {
  if (!donationAlerts.data) {
    return;
  }

  const foundIndex = donationAlerts.data.findIndex((i) => i.id === props.alert.id);

  if (foundIndex > -1) {
    donationAlerts.data.splice(foundIndex, 1);
    donationAlerts.save();
  }
}
</script>

<template>
  <MediaCard
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0  }"
  >
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text class="pa-4 pb-0">
          <v-form v-model="isFormValid">
            <v-text-field
              v-model="thresholdEdit"
              label="Amount Threshold in Dollars"
              prepend-icon="mdi-cash"
              autocomplete="off"
              :rules="[isRequired, isNumber, isZeroOrBigger]"
              filled
              dense
            />
            <v-text-field
              v-model="soundEdit"
              label="Sound Asset Name"
              prepend-icon="mdi-music-box"
              autocomplete="off"
              :rules="[isRequired, isValidAsset]"
              filled
              dense
            />
            <v-text-field
              v-model="volumeEdit"
              label="Volume in dB"
              prepend-icon="mdi-volume-high"
              autocomplete="off"
              :rules="[isRequired, isNumber, isZeroOrSmaller]"
              filled
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="save" :disabled="!isFormValid">Save</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-icon class="mr-2" @click="test">
      mdi-play
    </v-icon>
    <div class="flex-grow-1">
      ${{ alert.threshold }} - {{ alert.sound || 'N/A' }} ({{ alert.volume }} dB)
      <!-- {{ alert.graphic || 'N/A' }} ({{ alert.graphicDisplayTime }}s) -->
    </div>
    <v-icon @click="edit">
      mdi-pencil
    </v-icon>
    <v-icon @click="remove">
      mdi-delete
    </v-icon>
  </MediaCard>
</template>
