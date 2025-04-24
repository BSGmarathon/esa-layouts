<template>
  <div class="Flex runInfoRoot">
    <div
      v-show="runData"
      class="FlexColumn runDataContainer has-side-lines"
      :style="{
      'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
      'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
    }"
    >
      <canvas :width="canvasWidth" :height="canvasHeight" ref="runInfo"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';

import './tester/jsTifierExtensionFunctions';
import './tester/jsTifier';

type VAlign = 'top' | 'center' | 'bottom';
type HAlign = 'left' | 'center' | 'right' | 'justify';

interface JSTifierContextExtension {
  /* eslint-disable max-len */
  mlFillTextBsg: (text: string, x: number, y: number, w: number, h: number, vAlign: VAlign, hAlign: HAlign, lineHeight: number) => void;
  mlFillText: (text: string, x: number, y: number, w: number, h: number, vAlign: VAlign, hAlign: HAlign, lineHeight: number) => void;
  /* enable-disable max-len */
}

type CustomCanvasContext = CanvasRenderingContext2D & JSTifierContextExtension;

// TODO: https://stackoverflow.com/questions/4712242/wait-for-fonts-to-load-before-rendering-web-page
// useHead to insert the pre-load for the fonts.
@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @Prop({ type: Number }) readonly width!: number;
  @Prop({ type: Number }) readonly height!: number;
  @Prop({ type: String, default: 'center' }) readonly textAlign!: HAlign;
  @Prop({ type: Boolean, default: false }) lineLeft!: string;
  @Prop({ type: Boolean, default: false }) lineRight!: string;
  @Ref('runInfo') canvas!: HTMLCanvasElement;
  context!: CustomCanvasContext;

  get canvasWidth(): number {
    return this.width - 14;
  }

  get canvasHeight(): number {
    return this.height - 14;
  }

  setupMainFont() {
    this.context.fillStyle = 'white';
    this.context.font = '23px Goodlight';
    this.context.textAlign = 'left';
    this.context.textBaseline = 'ideographic';
  }

  drawConsole(system: string): void {
    // reset shadow
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;

    this.context.fillStyle = 'white';
    this.context.font = '15pt Corbel-Bold';

    this.context.mlFillText(
      system,
      0,
      (this.canvas.height / 2),
      this.canvas.width,
      50,
      'top',
      this.textAlign,
      35,
    );
  }

  drawCategoryEstimate(category: string, estimate: string): void {
    // reset shadow
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;

    this.context.fillStyle = '#cf773b';
    this.context.font = '15pt Goodlight';

    const textItem = `${category} | ${estimate}`;

    this.context.mlFillText(
      textItem,
      0,
      this.canvas.height - 45,
      this.canvas.width,
      45,
      'top',
      this.textAlign,
      35,
    );
  }

  fit(): void {
    this.context.fillStyle = '#404040';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const gameName = this.runData?.game;

    if (gameName) {
      this.context.mlFillTextBsg(
        gameName.trim().toUpperCase(),
        0,
        5,
        this.canvas.width,
        this.canvas.height / 2,
        'top',
        this.textAlign,
        35,
      );
    }

    const system = this.runData?.system;

    if (system) {
      this.drawConsole(system.toUpperCase());
    }

    const category = this.runData?.category;
    const estimate = this.runData?.estimate;

    if (category && estimate) {
      this.drawCategoryEstimate(category.toUpperCase(), estimate.toUpperCase());
    }
  }

  async mounted(): Promise<void> {
    this.context = this.canvas.getContext('2d') as CustomCanvasContext;
    this.setupMainFont();
    await Vue.nextTick();
    this.fit();
  }

  destroyed(): void {
    //
  }

  @Watch('runData', { deep: true })
  async onRunDataChange(): Promise<void> {
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
  // Ensure the font is loaded
  font-weight: 300;
  font-family: Goodlight;
}

.runDataContainer {
  box-sizing: border-box;
  //padding: 5px 20px;
  //padding: 8px;
  justify-content: flex-start;
}
</style>
