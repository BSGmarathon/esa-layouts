<template>
  <div
    class="WarOther"
    :style="{
      height: '100%',
      display: 'flex',
      'align-items': 'center',
    }"
  >
    <div
      :style="{
        'flex-grow': 1,
        display: 'flex',
        height: '70px',
        overflow: 'hidden',
      }"
    >
      <div
        :style="{
          display: 'flex',
          'justify-content': 'center',
          'flex-direction': 'column',
          'font-size': '20px',
          'text-align': 'center',
          padding: '0 10px',
          'white-space': 'nowrap',
          'line-height': '150%',
        }"
      >
        {{ bid.game }}
        <br>{{ bid.name }}
      </div>
      <div
        :style="{
          width: '3px',
          'background-color': 'white',
        }"
      />
      <div
        ref="OptionsBar"
        :style="{
          position: 'relative',
          'flex-grow': 1,
          'white-space': 'nowrap',
          'font-size': '20px',
          overflow: 'hidden',
          display: 'flex',
          'align-items': 'center',
        }"
      >
        <div
          v-for="(option, i) in optionCache" :key="option.id"
          class="Option"
          :style="{
            'background-color': option.winning ? '#6DD47E' : '#B37BA4',
            'margin-left': i > 0 ? '5px' : '0',
          }"
          :ref="`Option${i + 1}`"
        >
          <span :style="{ 'font-weight': 600 }">
            {{ option.name }}
            </span>: {{ formatUSD(option.total) }}
        </div>
        <div
          v-if="bid.allowUserOptions"
          class="Option"
          :ref="`Option${options.length + 1}`"
        >
          <template v-if="!options.length">No options submitted yet, be the first!</template>
          <template v-else>...or submit your own!</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatUSD, wait, areObjectsEqual } from '@esa-layouts/graphics/_misc/helpers';
import { Bids } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { orderBy } from 'lodash';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { getBid } from '@esa-layouts/omnibar/utils/bidwars';

gsap.registerPlugin(ScrollToPlugin);

type Option = { id: number, name: string, total: number, winning: boolean };

@Component
export default class extends Vue {
  @Prop({ type: Number, required: true }) readonly seconds!: number;
  @Prop({ type: Number, required: true }) readonly bidId!: number;
  @Ref('OptionsBar') optionsBar!: HTMLElement;
  formatUSD = formatUSD;
  bidHasUpdated = true;
  bid!: Bids[0];
  optionCache: Option[] = [];
  timeline: gsap.core.Timeline | undefined;
  @replicantNS.State(
    (s) => s.reps.bids,
  ) readonly allBids!: Bids;

  get options(): Option[] {
    const ordered = orderBy(this.bid.options, ['total'], ['desc']);
    return ordered.map(({ id, name, total }, i) => (
      { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
  }

  getOptions(): Option[] {
    const ordered = orderBy(this.bid.options, ['total'], ['desc']);
    return ordered.map(({ id, name, total }, i) => (
      { id, name, total, winning: (i === 0 || total >= ordered[0].total) && total > 0 }));
  }

  getRef(name: string): HTMLElement {
    const rep: HTMLElement | HTMLElement[] = (this.$refs[name] as HTMLElement[]);
    return Array.isArray(rep) ? rep[0] : rep;
  }

  async created(): Promise<void> {
    // Copied in case the prop changes and ruins the animations.
    this.bid = getBid(this.allBids, this.bidId);
    this.optionCache = this.getOptions();
  }

  async mounted(): Promise<void> {
    await this.mountedCallback();
  }

  async mountedCallback(): Promise<void> {
    // If no need to scroll, just wait a flat X seconds before ending.
    if (this.optionsBar.scrollWidth <= this.optionsBar.clientWidth) {
      if (this.seconds >= 0) {
        await wait(this.seconds * 1000);
        this.$emit('end');
      }

      return;
    }

    await this.createTimeline();
  }

  async createTimeline(): Promise<void> {
    this.bidHasUpdated = false;

    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        window.setTimeout(() => {
          if (this.seconds >= 0) {
            this.$emit('end');
          } else if (this.bidHasUpdated) {
            this.resetForBidUpdate().catch(console.log);
          } else {
            // If pinned and no updates, restart the timeline on end.
            this.timeline?.restart();
          }
        }, 4000);
      },
    });

    await wait(4000);
    const loopLength = this.bid.allowUserOptions ? this.options.length + 1 : this.options.length;
    const endPos = this.optionsBar.scrollWidth - this.optionsBar.clientWidth;

    // Check how many times we need to scroll along to fit everything in.
    let scrollCount = 0;
    for (let i = 1; i < loopLength; i += 1) {
      const rep = this.getRef(`Option${i + 1}`);
      if (endPos > rep.offsetLeft) scrollCount += 1;
    }

    // Add animations to timeline to scroll correctly.
    for (let i = 1; i < loopLength; i += 1) {
      const rep = this.getRef(`Option${i + 1}`);
      const insertionPosition = i > 1
        ? `+=${Math.max((this.seconds - 8) / (scrollCount + 1), 2)}`
        : undefined;

      this.timeline.to(this.optionsBar, {
        scrollLeft: Math.min(rep.offsetLeft, endPos),
        duration: 2,
      }, insertionPosition);
      if (endPos <= rep.offsetLeft) break;
    }

    // If pinned, scroll back to the start on finish.
    if (this.seconds < 1) {
      this.timeline.to(this.optionsBar, {
        scrollTo: { x: 0 },
        duration: 2,
      }, '+=4');
    }

    this.timeline.resume();
  }

  beforeDestroy(): void {
    this.killTimeline();
  }

  killTimeline(): void {
    this.timeline?.kill();
    delete this.timeline;
  }

  async resetForBidUpdate() {
    this.killTimeline();

    this.bid = getBid(this.allBids, this.bidId);
    this.optionCache = this.getOptions();

    // Do we need this wait? IDK
    // Do I feel more comfy having it here? YES!!!!
    await this.$nextTick();

    await this.mountedCallback();
  }

  @Watch('allBids', { deep: true })
  onBidRepChange(newVal: Bids): void {
    const ourBId = getBid(newVal, this.bidId);
    if (!areObjectsEqual(this.bid, ourBId)) {
      this.bidHasUpdated = true;

      if (!this.timeline?.isActive()) {
        this.resetForBidUpdate().catch(console.log);
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .WarOther {
    --mask: linear-gradient(to right,
    rgba(0,0,0, 1) 0,   rgba(0,0,0, 1) 40%,
    rgba(0,0,0, 1) 98%, rgba(0,0,0, 0) 100%
    ) 100% 50% / 100% 100% repeat-y;

    -webkit-mask: var(--mask);
    mask: var(--mask);
  }

  .Option {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 12px;
    font-size: 25px;

    &:last-of-type {
      margin-right: 10px;
    }
  }
</style>
