<template>
  <div
    id="Ticker"
    class="Grid"
    :style="{
      flex: 1,
      overflow: 'hidden',
      height: '100%',
      'padding-top': '0',
      // 'min-width': 0, // was probably used for overlapping things?
    }"
  >
    <transition name="ticker">
      <component
        v-if="omnibar.current && mayShow"
        :is="omnibar.current.type"
        :key="`${omnibar.current.type}${JSON.stringify(omnibar.current.props)}`"
        v-bind="omnibar.current.props"
        @end="showNext"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { awaitTimeout, wait, areObjectsEqual } from '@esa-layouts/graphics/_misc/helpers';
import { Omnibar } from '@esa-layouts/types/schemas';
import { Vue, Component, Watch } from 'vue-property-decorator';
import GenericMsg from './Ticker/GenericMsg.vue';
import Tweet from './Ticker/Tweet.vue';
import MiniCredits from './Ticker/MiniCredits.vue';
import CrowdControl from './Ticker/CrowdControl.vue';
import UpcomingRun from './Ticker/UpcomingRun.vue';
import Prize from './Ticker/Prize.vue';
import Bid from './Ticker/Bid.vue';
import Milestone from './Ticker/Milestone.vue';

@Component({
  components: {
    GenericMsg,
    Tweet,
    MiniCredits,
    CrowdControl,
    UpcomingRun,
    Prize,
    Milestone,
    Bid,
  },
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.omnibar) readonly omnibar!: Omnibar;
  mayShow = true;

  // Sends "omnibarShowNext" to extension; retries if not successful after 5s.
  async showNext(): Promise<void> {
    try {
      await awaitTimeout(nodecg.sendMessage('omnibarShowNext'), 5000);
    } catch (err) {
      this.showNext();
    }
  }

  @Watch('omnibar')
  async onOmnibarChange(newVal?: Omnibar, oldVal?: Omnibar): Promise<void> {
    // if there was no change, we don't need to hide stuff
    if (areObjectsEqual(newVal, oldVal)) {
      return;
    }

    this.mayShow = false;
    await Vue.nextTick();
    await wait(500);

    const oldDash = oldVal?.current?.props?.dash;
    const nextDash = newVal?.current?.props?.dash;

    // if the dash has changed, we need to clear it out and set the new dash
    if (!areObjectsEqual(oldDash, nextDash)) {
      // Wait for the dash to hide before showing next
      this.$emit('set-dash', null);
      await wait(500);
      await Vue.nextTick();

      // wait before starting the next animation
      await wait(600);

      this.$emit('set-dash', nextDash);
      await Vue.nextTick();

      if (nextDash) {
        await wait(600);
      }
    }

    this.mayShow = true;
  }
}
</script>

<style lang="scss" scoped>
  #Ticker {
    height: 100%;
    min-width: 0;
    flex: 1;
    padding-top: 2px;
    margin-left: 12px;
    align-items: center;
    font-family: 'Goodlight';
  }

  .ticker-leave-active {
    animation: fadeOutUp;
    animation-duration: 500ms;
    animation-timing-function: ease-in-out;
  }

  .ticker-enter-active {
    animation: fadeInUp;
    animation-duration: 500ms;
    animation-timing-function: ease-in-out;
  }

  .ticker-enter, .ticker-leave-to {
    opacity: 0;
  }
</style>
