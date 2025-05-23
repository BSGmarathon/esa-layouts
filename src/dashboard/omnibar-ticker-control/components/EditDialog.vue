<script setup lang="ts">
import { Omnibar } from '@esa-layouts/types/schemas';
import clone from 'clone';
import { computed, ref, watch } from 'vue';
import { VTextarea } from 'vuetify/components';
import { ValidationRule } from 'vuetify/framework';
import { useOmnibarStore } from '../store';

type AdditionalField = {
  elem: any,
  name: string,
  key: string,
  icon: string,
  rules: ValidationRule[],
  props: { [k: string]: boolean | number | string },
};

// Validation functions.
function isRequired(val: string): boolean | string {
  return !!val || 'Required';
}

function isNumber(val: string): boolean | string {
  return !Number.isNaN(Number(val)) || 'Must be a number';
}

function isBiggerThan(val: string): boolean | string {
  const num = Number(val);
  return (!!num && num >= 5) || 'Must be 5 or higher';
}

function is2LinesOrLess(val: string): boolean | string {
  const lines = val.split('\n');
  return lines.length <= 2 || 'Must be 2 lines or less';
}

const store = useOmnibarStore();
const isFormValid = ref(false);
const item = ref<Omnibar['rotation'][0] | null>(null);
const secondsStr = computed(() => (item.value?.type === 'Bid' ? 'Minimum Length (seconds)' : 'Length (seconds)'));
const additionalFields = computed<AdditionalField[]>(() => {
  switch (item.value?.type) {
    case 'GenericMsg':
      return [
        {
          elem: VTextarea,
          name: 'Message',
          key: 'msg',
          icon: 'mdi-android-messages',
          rules: [isRequired, is2LinesOrLess],
          props: {
            'no-resize': true,
            rows: 2,
          },
        },
      ];
    default:
      return [];
  }
});

const secondsValue = computed({
  get: () => item.value?.props?.seconds,
  set: (val: string) => {
    if (item.value?.props?.seconds && !Number.isNaN(Number(val))) {
      item.value.props.seconds = Number(val);
    }
  },
});

function save(): void {
  if (item.value) {
    store.updateLocalItem(item.value);
    store.editDialog = false;
  }
}

watch(() => store.editDialog, (isOpen) => {
  if (isOpen) {
    item.value = clone(store.localRotation.find((r) => r.id === store.editItemId)) || null;
  } else {
    item.value = null;
  }
});
</script>

<template>
  <v-dialog class="Dialog" v-model="store.editDialog" persistent>
    <v-card>
      <v-card-text v-if="item && item.props" class="pa-4 pb-0"><!-- TODO: move v-if? -->
        <v-form v-model="isFormValid">
          <!-- Length (seconds) -->
          <v-text-field
            v-model="secondsValue"
            :label="secondsStr"
            prepend-icon="mdi-timer"
            autocomplete="off"
            :rules="[isRequired, isNumber, isBiggerThan]"
            filled
            dense
            type="number"
            :min="5"
          />
          <!-- Additional Fields -->
          <component
            v-for="{ elem, name, key, icon, rules, props } in additionalFields"
            :is="elem"
            v-model="item.props[key]"
            :key="key"
            :label="name"
            :prepend-icon="icon"
            autocomplete="off"
            :rules="rules"
            filled
            dense
            v-bind="props"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="save" :disabled="!isFormValid">Save</v-btn>
        <v-btn @click="store.editDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
