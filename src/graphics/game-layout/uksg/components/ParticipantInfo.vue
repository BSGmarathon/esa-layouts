<script setup lang="ts">
import { computed } from 'vue';
import { commentatorsNew, donationReaderNew, runDataActiveRun } from '../../../../browser_shared/replicant_store';
import CutOffBorderedElem from './CutOffBorderedElem.vue';

const props = withDefaults(defineProps<{
  type: 'player' | 'host' | 'comm1' | 'comm2',
  index?: number,
  headerFontSize?: string,
  headerWidth?: string,
  nameFontSize?: string,
  cutEdgeSize?: string,
}>(), {
  index: 0,
  headerFontSize: '20px',
  headerWidth: undefined,
  nameFontSize: '26px',
  cutEdgeSize: '15px',
});

const user = computed(() => {
  if (props.type === 'player') return runDataActiveRun?.data?.teams[props.index]?.players[0];
  if (props.type === 'host') return donationReaderNew?.data;
  if (props.type === 'comm1') return commentatorsNew?.data?.[0];
  if (props.type === 'comm2') return commentatorsNew?.data?.[1];
  return null;
});
const headerText = computed(() => {
  if (props.type === 'player') return 'Runner';
  if (props.type === 'host') return 'Host';
  if (props.type === 'comm1' || props.type === 'comm2') return 'Comm';
  return undefined;
});
const headerTextColour = computed(() => {
  if (props.type === 'host') return '#71b7f1';
  if (props.type === 'comm1' || props.type === 'comm2') return '#2dbf9e';
  return undefined;
});
const headerColour = computed(() => {
  if (props.type === 'host') return '#0c3f6b';
  if (props.type === 'comm1' || props.type === 'comm2') return '#003134';
  return 'linear-gradient(33deg, #1b6ebb 0%, #348bd2 100%)';
});
const name = computed(() => user.value?.name);
const pronouns = computed(() => user.value?.pronouns);
</script>

<template>
  <CutOffBorderedElem
    class="Fixed"
    :class="{
      [$style.WrapperRemove]: !name,
      [$style.Player]: type === 'player',
    }"
    :header-colour="headerColour"
    :header-text-colour="headerTextColour"
    :header-font-size="headerFontSize"
    :header-width="headerWidth"
    :cut-edge-size="cutEdgeSize"
    :border-dark="type !== 'player'"
  >
    <template #header>
      {{ headerText }}
    </template>
    <template #content>
      <span :class="$style.Content">{{ name ?? '???' }}</span>
    </template>
    <template
      v-if="pronouns"
      #subtitle
    >
      {{ pronouns }}
    </template>
  </CutOffBorderedElem>
</template>

<style module lang="scss">
.WrapperRemove {
  opacity: 0;
}

.Player {
  z-index: 1;
}

.Content {
  font-size: v-bind(nameFontSize);
  font-weight: 700;
}
</style>
