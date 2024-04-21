<template>
  <div
    class="Flex"
    :style="{
      height: '100%',
      width: '100%',
      'justify-content': 'center',
    }"
  >
    <div
      v-show="runData"
      ref="RunInfo"
      class="FlexColumn has-side-lines"
      :style="{
      'box-sizing': 'border-box',
      'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
      'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
      'font-size': '36pt',
      'font-family': 'Goodlight',
      'text-align': 'left',
      // padding: '5px 20px',
      'line-height': lineHeight || 'unset',
      'white-space': 'normal',
      'padding-top': '12px',
    }"
    >
      <div
        class="Flex"
        :style="{
      width: '100%',
      height: '75px',
      'text-align': textAlignCss,
      position: 'relative',
      'justify-content': textAlign,
      'align-items': textAlign,
    }">
        <div
          v-show="runData && runData.game"
          class="RunGame"
          :style="{
        'font-family': 'Goodlight',
        'font-size': '20px',
        'font-weight': 600,
        'line-height': 1.5,
        display: 'flex',
        'max-width': '100%',
      }">
          <template v-if="runData && runData.game">
            {{ runData.game }}
          </template>
        </div>
      </div>

      <div
        class="Flex"
        :style="{
      width: '100%',
      height: '100%',
      'font-size': '55pt',
      'text-align': textAlignCss,
      'justify-content': textAlign,
      'align-items': 'baseline',
    }">
        <div
          v-show="runData && (runData.category || runData.system || runData.estimate)"
          :class="{
          'FlexColumn': !infoIsRow,
          'FlexRow': infoIsRow,
        }"
          class="RunInfoExtra"
          :style="{
          height: '100%',
          width: '99%',
          'font-size': '2em', // Also gets set in the script, here as backup.
          'text-align': textAlignCss,
          'font-weight': 300,
          'font-family': 'Goodlight',
        }"
        >
          <template v-if="runData">
          <span class="systemEst" :style="{
            'align-self': textAlign,
            'font-family': 'Corbel-Bold',
          }">
            <span v-if="runData.system" class="system">{{ runData.system }}</span>
            <span v-if="runData.release" class="release">{{ runData.release }}</span>
          </span>
            <div class="catEstBlock" :style="{
            'align-self': textAlign,
          }">
            <span v-if="runData.category" class="categoryEst" :style="{
                      color: 'var(--bsg-color)',
                      'font-size': '18pt',
                      'white-space': 'normal',
                }">{{ runData.category }}</span>
              <span v-if="runData.estimate" class="categoryEst" :style="{
                color: 'var(--bsg-color)',
                      'font-size': '18pt',
                      'white-space': 'normal',
                }">{{ runData.estimate }}</span>
            </div>
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

  get hek(): boolean {
    return this.runData?.customData.info === 'HEK';
  }

  fit(): void {
    const elem = this.$refs.RunInfo as HTMLElement;
    if (elem) {
      if (!this.noWrap) {
        [this.fittyGame] = fitty('.RunGame', {
          minSize: 1,
          maxSize: parseInt(elem.style.fontSize, 10) * 1.2,
        });
        [this.fittyInfoExtra] = fitty('.RunInfoExtra', {
          minSize: 1,
          maxSize: parseInt(elem.style.fontSize, 10) * 0.9,
        });
      } else {
        // If there is no horizontal fitting, will crudely attempt to
        // reduce line height if needed, just in case.
        const scale = elem.clientHeight / elem.scrollHeight;
        if (scale < 1) {
          this.lineHeight = `${(scale - 0.1) * 100}%`;
        } else {
          this.lineHeight = null;
        }
      }
    }
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

  @Watch('runData')
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
.RunGame {
  margin-top: 10px;
  position: relative;
  text-align: center !important;
  text-shadow: 5px 5px 0px var(--bsg-color), 5px 7px 3px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  white-space: unset !important;
}

.systemEst {
  align-self: flex-start;
  text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  display: inline-flex;
}

.catEstBlock {
  display: inline-flex;
  text-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  //align-self: flex-end;
  margin-bottom: 15px;
}

.RunInfoExtra {
  display: flex !important;
  justify-content: space-between;
  align-content: flex-start;
  margin-top: 5px;

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
    content: ' - ';
    color: var(--text-color);
    display: inline-block;
    margin-left: 15px;
    margin-right: 15px;
  }
}

.categoryEst {
  text-transform: uppercase;
}
</style>
