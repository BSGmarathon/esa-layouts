<script setup lang="ts">
import { lowerThird } from '@esa-layouts/browser_shared/replicant_store';
import { computed, ref } from 'vue';
import { useHead } from '@vueuse/head';

useHead({ title: 'Lower-third control' });

const nameEntry = ref('');
const updatingName = ref(false);
const autoHide = ref(true);
const autoHideSeconds = ref('10');
const toggleButtonsDisabled = computed(() => lowerThird.data?.transitioning || updatingName.value);
const inputsDisabled = computed(() => toggleButtonsDisabled.value || lowerThird.data?.visible);

function showLowerThird(): void {
  let finalAutoHide = autoHide.value;
  const afterSecs = parseInt(autoHideSeconds.value, 10);

  if (Number.isNaN(afterSecs) || afterSecs < 1) {
    finalAutoHide = false;
  }

  nodecg.sendMessage('lower-third:show', {
    autoHide: finalAutoHide, showForSecs: afterSecs,
  });
}

function hideLowerThird(): void {
  nodecg.sendMessage('lower-third:hide');
}

function removeName(name: string) {
  const currentLt = lowerThird.data!.names;
  const nameIndex = currentLt.indexOf(name);

  if (nameIndex > -1) {
    currentLt.splice(nameIndex, 1);
  }

  lowerThird.save();
}

async function add(): Promise<void> {
  updatingName.value = true;
  try {
    await nodecg.sendMessage('lower-third:add-name', nameEntry.value);
  } catch (err) {
    // catch
  }
  updatingName.value = false;
  nameEntry.value = '';
}

</script>

<template>
  <v-app v-if="lowerThird.data">
    <v-card
      :style="{ 'margin-bottom': '10px' }"
      tile
    >
      <v-list density="compact">
        <v-list-item
          v-for="(name, i) in lowerThird.data.names"
          :key="i"
          inactive
          selectable
        >
          <template v-slot:prepend>
            <v-list-item-action>
              <v-icon @click="removeName(name)">mdi-delete</v-icon>
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
    <div class="d-flex">
      <v-text-field
        v-model="nameEntry"
        label="Enter Name Here"
        hide-details
        filled
        :spellcheck="false"
        :disabled="inputsDisabled"
        @keyup.enter="add"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="inputsDisabled"
        @click="add"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <div class="d-flex" style="margin-top: 10px;">
      <v-btn
        height="56px"
        :style="{ 'margin-left': '5px' }"
        @click="showLowerThird"
        :disabled="toggleButtonsDisabled || lowerThird.data.visible">
        Show
      </v-btn>
      <v-btn
        height="56px"
        :style="{ 'margin-left': '5px' }"
        @click="hideLowerThird"
        :disabled="autoHide || toggleButtonsDisabled || !lowerThird.data.visible">
        Hide
      </v-btn>
    </div>
    <div class="d-flex" style="margin-top: 10px;">
      <v-checkbox
        v-model="autoHide"
        :disabled="inputsDisabled"
        label="Auto hide after"
      />

      <v-text-field
        v-model="autoHideSeconds"
        label="seconds"
        :style="{
          'width': '10px',
        }"
        hide-details
        filled
        :spellcheck="false"
        :disabled="inputsDisabled"
      />
    </div>
  </v-app>
</template>
