<template>
  <div
    v-show="runData"
    ref="RunInfo"
    class="FlexColumn"
    :style="{
      'font-size': '36pt',
       'font-family': 'Goodlight',
      width: '100%',
      'text-align': 'left',
      padding: '5px 20px',
      'box-sizing': 'border-box',
      'min-height': 0,
      'line-height': lineHeight || 'unset',
      'white-space': 'normal',
    }"
  >
    <div
      class="Flex"
      :style="{ width: '100%' }"
    >
      <div
        v-show="runData && runData.game"
        class="RunGame"
        :style="{
        'font-family': 'Goodlight',
        'font-size': '24pt',
        'font-weight': 600,
        'text-align': 'left',
        'line-height': 1.5,
        'display': 'flex',
        'width': '90%',
        'justify-content': 'left',
        'align-items': 'left',
        'padding-top': '12px',
        }"
      >
        <template v-if="runData && runData.game">
          {{ runData.game }}
        </template>
      </div>
    </div>
    <div
    class="Flex"
    :style="{ width: '100%',
    'font-size': '55pt',
    'text-align': 'left', }"
    >
      <div
        v-show="runData && (runData.category || runData.system || runData.estimate)"
        class="RunInfoExtra"
        :style="{
          'font-size': '0.5em', // Also gets set in the script, here as backup.
          'text-align': 'left',
        }"
      >
        <template v-if="runData">
            <span v-if="runData.system" :style="{
            'font-family': 'Goodlight-light',
            }">{{ runData.system }}</span><br>
              <span v-if="runData.category" :style="{
                    color: '#cf773b',
                    'font-size': '21pt',
                    'white-space': 'normal',
                    'font-family': 'Goodlight-light',
              }">{{ runData.category }}</span>
              <span :style="{
              color: '#d7d7d7',
              }">//</span>
              <span v-if="runData.estimate" :style="{
              color: '#d7d7d7',
                    'font-size': '21pt',
                    'white-space': 'normal',
                    'font-family': 'Goodlight-light',
              }">{{ runData.estimate }}</span>
        </template>
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
          maxSize: parseInt(elem.style.fontSize, 10) * 0.8,
        });
        [this.fittyInfoExtra] = fitty('.RunInfoExtra', {
          minSize: 1,
          maxSize: parseInt(elem.style.fontSize, 10) * 0.6,
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

  @Watch('runData')
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Re-fit the elements if run data becomes definded (as elements do no exist before this).
    if ((newVal && !oldVal) || this.noWrap) {
      this.lineHeight = null;
      await Vue.nextTick();
      this.fit();
    }
  }
}
</script>

<style scoped>
  /*.RunInfoExtra > span:not(:last-child)::after {
    content: ' /';
  }*/

  .flashingLightsWarning {
    background-color: red;
    box-sizing: border-box;
    padding: 7px;
    position: relative;
    color: white;
    line-height: 50px;
  }
</style>
