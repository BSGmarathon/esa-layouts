<script setup lang="ts">
import MediaCard from '@esa-layouts/dashboard/_misc/components/MediaCard.vue';
import { DonationTotalMilestones } from '@esa-layouts/types/schemas';
import { donationTotal as total, omnibar, donationTotalMilestones } from '@esa-layouts/browser_shared/replicant_store';
import { computed, ref } from 'vue';
import clone from 'clone';

interface MilestoneProps {
  milestone: DonationTotalMilestones[0];
  index: number;
}

const props = defineProps<MilestoneProps>();

const dialog = ref(false);
const nameEdit = ref('');
const additionToggleEdit = ref(false);
const additionEdit = ref('0');
const amountEdit = ref('0');
const isFormValid = ref(false);

const currentPin = computed(() => omnibar.data?.pin);
const toggle = computed({
  get: () => props.milestone.enabled,
  set: (val: boolean) => {
    const items = donationTotalMilestones.data;

    if (!items) {
      return;
    }

    const item = items.find((i) => i.id === props.milestone.id);

    if (item && (item.addition || item.amount)) {
      item.enabled = val;

      if (item.addition) {
        item.amount = val
          ? (total.data ?? 0) + item.addition
          : undefined;
      }
    }

    donationTotalMilestones.save();
  },
});

// const disableSave = computed(() => !(nameEdit.value
//   && ((additionToggleEdit.value && additionEdit.value)
//     || (!additionToggleEdit.value && amountEdit.value))));

const isMet = computed(() => !!(props.milestone.amount && (total.data ?? 0) >= props.milestone.amount));
const isPinned = computed(() => currentPin.value?.type === 'Milestone' && currentPin.value?.id === props.milestone.id);

function isRequired(val: string): boolean | string {
  return !!val || 'Required';
}

function isNumber(val: string): boolean | string {
  return !Number.isNaN(Number(val)) || 'Must be a number';
}

function isBiggerThanZero(val: string): boolean | string {
  const num = Number(val);
  return (!!num && num > 0) || 'Must be bigger than 0';
}

function formatAmount(val: number): string {
  return val.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function pin(): void {
  const newPin = !isPinned.value;

  omnibar.data!.pin = newPin ? { type: 'Milestone', id: props.milestone.id } : null;
  omnibar.save();
}

function edit(): void {
  dialog.value = true;
  nameEdit.value = props.milestone.name;
  additionToggleEdit.value = !!props.milestone.addition;
  additionEdit.value = props.milestone.addition?.toString() ?? '0';
  amountEdit.value = props.milestone.amount?.toString() ?? '0';
}

function save(): void {
  if (!donationTotalMilestones.data) {
    return;
  }

  const item: DonationTotalMilestones[0] = {
    id: props.milestone.id,
    name: nameEdit.value,
    enabled: props.milestone.enabled,
  };

  if (props.milestone.enabled) {
    item.addition = props.milestone.addition;
    item.amount = props.milestone.amount;
  } else {
    item.addition = additionToggleEdit.value ? Number(additionEdit.value) : undefined;
    item.amount = !additionToggleEdit.value ? Number(amountEdit.value) : undefined;
  }

  const itemIndex = donationTotalMilestones.data.findIndex((i) => i.id === item.id);

  if (itemIndex > -1) {
    donationTotalMilestones.data[itemIndex] = clone(item);
    donationTotalMilestones.save();
  }

  dialog.value = false;
}

function remove(): void {
  if (!donationTotalMilestones.data) {
    return;
  }

  const itemIndex = donationTotalMilestones.data.findIndex((i) => i.id === props.milestone.id);

  if (itemIndex > -1) {
    donationTotalMilestones.data.splice(itemIndex, 1);
    donationTotalMilestones.save();
  }
}
</script>

<template>
  <MediaCard
    class="d-flex align-center px-2"
    :style="{ 'text-align': 'unset', height: '40px', 'margin-top': index > 0 ? '10px' : 0 }"
  >
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text class="pa-4 pb-0">
          <v-form v-model="isFormValid">
            <v-text-field
              v-model="nameEdit"
              prepend-icon="mdi-application"
              autocomplete="off"
              :rules="[isRequired]"
              filled
              dense
            />
            <v-switch
              v-model="additionToggleEdit"
              class="pa-0 ma-0 pb-2 pl-10"
              label="Toggle &quot;Addition&quot; Mode"
              hide-details
              inset
              :disabled="milestone.enabled"
            />
            <v-text-field
              v-if="additionToggleEdit"
              v-model="additionEdit"
              prepend-icon="mdi-cash-plus"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
              filled
              dense
              :disabled="milestone.enabled"
            />
            <v-text-field
              v-else
              v-model="amountEdit"
              prepend-icon="mdi-cash"
              autocomplete="off"
              :rules="[isRequired, isNumber, isBiggerThanZero]"
              filled
              dense
              :disabled="milestone.enabled"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="save" :disabled="!isFormValid">Save</v-btn>
          <v-btn @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-checkbox
      class="pa-0 ma-0"
      hide-details
      v-model="toggle"
      :disabled="!milestone.amount && !milestone.addition"
    />
    <div class="flex-grow-1">{{ milestone.name }}</div>
    <div v-if="isMet" class="light-green--text accent-3 font-weight-bold pr-2">MET!</div>
    <div v-if="milestone.amount" class="d-flex pr-2">
      <v-icon class="pr-1">mdi-cash</v-icon>
      <div>€{{ formatAmount(milestone.amount) }}</div>
    </div>
    <div v-if="milestone.addition" class="d-flex pr-2">
      <v-icon class="pr-1">mdi-cash-plus</v-icon>
      €{{ formatAmount(milestone.addition) }}
    </div>
    <v-icon
      @click="pin"
      :disabled="(!milestone.amount && !milestone.addition) || !milestone.enabled"
    >
      <template v-if="isPinned">mdi-pin-off</template>
      <template v-else>mdi-pin</template>
    </v-icon>
    <v-icon @click="edit">
      mdi-pencil
    </v-icon>
    <v-icon @click="remove" :disabled="milestone.enabled">
      mdi-delete
    </v-icon>
  </MediaCard>
</template>
