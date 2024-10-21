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

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @Prop(Boolean) readonly noWrap!: boolean;
  @Prop(Boolean) readonly infoIsRow!: boolean;
  @Prop({ type: String, default: 'center' }) readonly textAlign!: string;
  @Prop({ type: Boolean, default: false }) lineLeft!: string;
  @Prop({ type: Boolean, default: false }) lineRight!: string;
  lineHeight: string | null = null;
  fittyGame: FittyInstance | undefined;
  fittyInfoExtra: FittyInstance | undefined;

  get gameNameUpper(): string {
    return this.runData?.game?.toUpperCase() ?? 'N/A';
  }

  fit(): void {
    // TODO: do we use this?
    if (this.noWrap) {
      const runInfoElem = this.$refs.RunInfo as HTMLElement;

      if (!runInfoElem) {
        return;
      }

      // If there is no horizontal fitting, will crudely attempt to
      // reduce line height if needed, just in case.
      const scale = runInfoElem.clientHeight / runInfoElem.scrollHeight;
      if (scale < 1) {
        this.lineHeight = `${(scale - 0.1) * 100}%`;
      } else {
        this.lineHeight = null;
      }

      return;
    }

    [this.fittyGame] = fitty('.RunGameParent', {
      minSize: 1,
      maxSize: 30,
    });
    [this.fittyInfoExtra] = fitty('.RunInfoExtra', {
      minSize: 1,
      maxSize: 30,
    });
  }

  mounted(): void {
    this.fit();
  }

  destroyed(): void {
    if (this.fittyGame) {
      this.fittyGame.unsubscribe();
    }
    if (this.fittyInfoExtra) {
      this.fittyInfoExtra.unsubscribe();
    }
  }

  get textAlignCss(): string {
    return this.textAlign === 'center' ? 'center' : 'left';
  }

  get cssPositionProps() {
    return {
      '--prop-text-align': this.textAlignCss,
      '--prop-justify-content': this.textAlign,
    };
  }

  @Watch('runData', { deep: true })
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Re-fit the elements if run data becomes definded (as elements do no exist before this).
    if ((newVal && !oldVal) || this.noWrap) {
      this.lineHeight = null;
    }

    await Vue.nextTick();
    this.fit();
  }
}
</script>

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
  overflow: hidden;
  height: auto;
  white-space: unset !important;
  font-size: 50pt;
  text-align: var(--prop-text-align);
  justify-content: var(--prop-justify-content);
  align-items: var(--prop-justify-content);
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
