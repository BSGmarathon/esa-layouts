<template>
  <div class="Flex">
    <div
      id="Total"
      class="Flex"
    >
      <span
        v-for="(char, i) in totalStr"
        :key="i"
        :class="(char === ',' ? 'Comma' : undefined)"
      >
        {{ char }}
      </span>
    </div>

    <div :style="{
      position: 'absolute',
      top: '10px',
      left: '-98px',
      'z-index': 99999999999,
    }">
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="alertList[0]"
          :key="alertList[0].timestamp"
          class="Flex coin-thing"
        >
          <img
            src="../omniing/RetroCoin.png"
            :style="{ height: '50px', 'image-rendering': 'pixelated', 'margin-right': '5px' }"
          >
          <span
            :style="{
                'font-size': '28px',
                color: '#7FFF00',
                'font-weight': 600,
                'background-color': 'rgba(0,0,0,0.6)',
                padding: '4px 8px',
                'border-radius': '10px',
              }"
          >
              {{ alertList[0] ? alertList[0].amount : '€0' }}
            </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { replicantModule } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component, Watch } from 'vue-property-decorator';
import gsap from 'gsap';

@Component
export default class extends Vue {
  total = 0;
  playingAlerts = false;
  showAlert = false;
  alertText = '€0';
  alertList: { total: number, amount: number }[] = [];

  get rawTotal(): number {
    return replicantModule.repsTyped.donationTotal;
  }

  get totalStr(): string {
    return formatUSD(this.total);
  }

  async playNextAlert(start = false): Promise<void> {
    this.playingAlerts = true;
    if (!start) await new Promise((res) => { setTimeout(res, 500); });
    if (this.alertList[0].amount > 0) { // Only show alerts for positive values
      nodecg.sendMessage('omnibarPlaySound');
      // await this.sfx.play();
      await new Promise((res) => { setTimeout(res, 500); });
      this.showAlert = true;
      this.alertText = formatUSD(this.alertList[0].amount);
    }
    gsap.to(this, {
      total: this.alertList[0].total,
      duration: 5,
    });
    await new Promise((res) => { setTimeout(res, 6000); });
    this.alertList.shift();
    this.showAlert = false;
    if (this.alertList.length) this.playNextAlert();
    else this.playingAlerts = false;
  }

  @Watch('rawTotal')
  onRawTotalChanged(newVal: number, oldVal: number): void {
    this.alertList.push({
      total: newVal,
      amount: newVal - oldVal,
    });
    if (!this.playingAlerts) this.playNextAlert(true);
  }

  async created(): Promise<void> {
    this.total = this.rawTotal;
  }
}
</script>

<style scoped>
  #Total {
    padding: 0 13px 0 0;
    font-size: 40px;
    font-weight: 500;
    text-align: left;
    float: right;
  }

  /* Each character in the total is in a span; setting width so the numbers appear monospaced. */
  #Total > span {
    padding-top: 14px;
    display: inline-block;
    text-align: center;
    background: var(--slide-color);
    position: relative;
  }

  #Total span:first-of-type {
    padding-left: 10px;
  }

  /*#Total span:first-of-type:before {
    content: '';
    position: absolute;
    background: url('../omniing/right_dash_front.png');
    background-position: center center;
    background-size: cover;
    height: 82px;
    width: 104px;
    left: -104px;
    top: 0px;
  }*/

  #Total span:last-of-type {
    padding-right: 10px;
  }

  /*#Total span:last-of-type:after {
    content: '';
    position: absolute;
    background: url('../omniing/right_dash_back.png');
    background-position: center center;
    background-size: cover;
    height: 82px;
    width: 44px;
    right: -44px;
    top: 0px;
  }*/

  #Total > .Comma {
    display: inline-block;
    width: 0.22em;
    text-align: center;
  }

  .coin-thing {
    z-index: 10000000;
  }

  /* TODO: implement animatecss with this */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter, .fade-leave-to
  /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
