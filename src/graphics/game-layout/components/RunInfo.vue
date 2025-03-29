<script setup lang="ts">
import fitty, { FittyInstance } from 'fitty';
import { computed, defineProps, nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { runDataActiveRun } from '@esa-layouts/browser_shared/replicant_store';

interface RunInfoProps {
  noWrap: boolean;
  infoIsRow: boolean;
  textAlign: string;
  lineLeft: boolean;
  lineRight: boolean;
}

const props = withDefaults(defineProps<RunInfoProps>(), {
  textAlign: 'center',
  infoIsRow: false,
  noWrap: false,
  lineLeft: false,
  lineRight: false,
});

const runData = computed(() => runDataActiveRun.value);
const lineHeight = ref<string | null>(null);
let fittyGame: FittyInstance | undefined;
let fittyInfoExtra: FittyInstance | undefined;
const runInfoElem = useTemplateRef<HTMLElement>('RunInfo');
const gameNameUpper = computed(() => runDataActiveRun.value?.game?.toUpperCase() ?? 'N/A');
const textAlignCss = computed(() => (props.textAlign === 'center' ? 'center' : 'left'));
const cssPositionProps = computed(() => ({
  '--prop-text-align': textAlignCss.value,
  '--prop-justify-content': props.textAlign,
}));

function fit(): void {
  // TODO: do we use this?
  if (props.noWrap) {
    if (!runInfoElem.value) {
      return;
    }

    // If there is no horizontal fitting, will crudely attempt to
    // reduce line height if needed, just in case.
    const scale = runInfoElem.value.clientHeight / runInfoElem.value.scrollHeight;
    if (scale < 1) {
      lineHeight.value = `${(scale - 0.1) * 100}%`;
    } else {
      lineHeight.value = null;
    }

    return;
  }

  [fittyGame] = fitty('#gameNameParent', {
    minSize: 1,
    maxSize: 23.5,
  });
  [fittyInfoExtra] = fitty('.RunInfoExtra', {
    minSize: 10,
    maxSize: 30,
  });
}

onMounted(() => {
  fit();
});

onUnmounted(() => {
  if (fittyGame) {
    fittyGame.unsubscribe();
  }
  if (fittyInfoExtra) {
    fittyInfoExtra.unsubscribe();
  }
});

// TODO: is it better to use this or a watch?
runDataActiveRun.on('change', async (newVal, oldVal) => {
  // Re-fit the elements if run data becomes definded (as elements do no exist before this).
  if ((newVal && !oldVal) || props.noWrap) {
    lineHeight.value = null;
  }

  await nextTick();
  fit();
});
</script>

<template>
  <div class="Flex runInfoRoot">
    <div
      v-show="runData"
      class="FlexColumn runDataContainer has-side-lines"
      :style="{
      'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
      'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
      'line-height': lineHeight || 'unset',
    }"
    >
      <div
        class="Flex RunGameParent"
        id="gameNameParent"
        ref="RunInfo"
        :style="cssPositionProps"
      >
        <div
          v-show="runData && runData.game"
          class="Flex RunGame"
        >
          {{ gameNameUpper }}
        </div>
      </div>

      <div
        class="Flex runInfoExtraContainer"
        :style="cssPositionProps"
      >
        <div
          v-show="runData && (runData.category || runData.system || runData.estimate)"
          :class="{
          'FlexColumn': !infoIsRow,
          'FlexRow': infoIsRow,
        }"
          class="RunInfoExtra"
          :style="cssPositionProps"
        >
          <template v-if="runData">
            <div class="catEstBlock" :style="{
               'align-self': textAlign,
              }"
            >
              <span v-if="runData.category" class="categoryEst">{{ runData.category }}</span>
            </div>
            <span class="systemEst" :style="{
              'align-self': textAlign,
            }">
              <span v-if="runData.system" class="system">{{ runData.system }}</span>
              <span v-if="runData.release" class="release">{{ runData.release }}</span>
              <span v-if="runData.estimate" class="estimate">{{ runData.estimate }}</span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.runInfoRoot {
  height: 100%;
  width: 100%;
  justify-content: center;
}

.runDataContainer {
  box-sizing: border-box;
  //padding: 5px 20px;
  padding: 8px;
  justify-content: flex-start;
}

.RunGameParent {
  flex: 0 1 auto;
  /* The above is shorthand for:
   flex-grow: 0,
   flex-shrink: 1,
   flex-basis: auto
  */
  width: 100%;
  position: relative;
  display: block;
  //overflow: hidden;
  height: auto;
  max-height: 85%;
  white-space: unset !important;
  font-size: 50pt;
  text-align: var(--prop-text-align);
  justify-content: var(--prop-justify-content);
  align-items: var(--prop-justify-content);
  //background: rebeccapurple;
}

.RunGame {
  display: inline-flex;
  font-family: Goodlight;
  font-weight: 600;
  margin-top: 10px;
  position: relative;
  text-shadow: 0.1em 0.05em 0px var(--bsg-color), 0.1em 0.15em 3px rgba(0, 0, 0, 0.5);
  //font-size: 3em;
}

.runInfoExtraContainer {
  flex: 1 1 auto;
  width: 100%;
  //height: 100%;
  height: auto;
  font-size: 20pt;
  align-items: baseline;
  //background-color: orange;
  text-align: var(--prop-text-align);
  justify-content: var(--prop-justify-content);
}

.system {
  text-transform: uppercase;
}

.systemEst {
  //align-self: flex-start;
  // Is this cheating and wrong? Probably, don't care tho
  margin-top: -6px;
  text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  display: inline-flex;
  font-family: Corbel-Bold;
}

.catEstBlock {
  display: inline-flex;
  text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  //align-self: flex-start;
  //margin-bottom: 15px;
}

.RunInfoExtra {
  display: flex !important;
  justify-content: space-between;
  align-content: flex-start;
  margin-top: 5px;
  font-size: 1em;
  height: 100%;
  width: 99%;
  font-weight: 300;
  font-family: Goodlight;
  text-align: var(--prop-text-align);

  //span {
  //  display: inline-block !important;
  //}

  &> .catEstBlock > span:not(:last-child)::after {
    content: ' | ';
    color: var(--text-color);
    display: inline-block;
    margin-left: 15px;
    margin-right: 15px;
  }

  &> .systemEst > span:not(:last-child)::after {
    content: ' | ';
    color: var(--bsg-color);
    display: inline-block;
    margin-left: 15px;
    margin-right: 15px;
  }
}

.categoryEst {
  text-transform: uppercase;
  color: var(--bsg-color);
  font-size: 1rem;
  white-space: normal;
}
</style>
