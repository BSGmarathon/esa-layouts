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
      left: '20px',
      'z-index': 99999999999,
    }">
      <div
        v-if="alertList[0]"
        :style="{
              'z-index': 1,
              opacity: showAlert ? 1 : 0,
              transition: 'opacity 0.5s',
          }"
        class="Flex coin-thing"
      >
        <img
          src="./img/RetroCoin.png"
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
    </div>
  </div>
</template>

<script lang="ts">
import { replicantModule, replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component } from 'vue-property-decorator';
import { AdditionalDonations } from '@esa-layouts/types/schemas';
import gsap from 'gsap';
import { round } from 'lodash';

@Component
export default class extends Vue {
  // @Ref('SFX') sfx!: HTMLAudioElement;
  theme = nodecg.bundleConfig.event.theme;
  total = 0;
  playingAlerts = false;
  showAlert = false;
  alertText = '€0';
  alertList: { total?: number, amount?: number, showAlert: boolean }[] = [];
  donationTotalTimeout: number | undefined;
  @replicantNS.State(
    (s) => s.reps.additionalDonations,
  ) readonly additionalDonations!: AdditionalDonations;
  additionalDonationsCfg = nodecg.bundleConfig.additionalDonations;

  get additionalDonationsMapped() {
    return this.additionalDonationsCfg.map((d) => ({
      key: d.key,
      description: d.description,
      amount: d.amount,
      active: this.additionalDonations.find((a) => a.key === d.key)?.active ?? false,
    }));
  }

  get additionalDonationsAmount() {
    return this.additionalDonationsMapped
      .filter((d) => d.active).reduce((partialSum, a) => partialSum + a.amount, 0);
  }

  get rawTotal(): number {
    return round(replicantModule.repsTyped.donationTotal + this.additionalDonationsAmount, 2);
  }

  get totalStr(): string {
    return formatUSD(this.total);
  }

  async playNextAlert(start = false): Promise<void> {
    nodecg.sendMessage('donationAlertsLogging', `playNextAlert called (start: ${start})`);
    clearTimeout(this.donationTotalTimeout); // Clearing here for safety
    this.playingAlerts = true;
    if (!start) await new Promise((res) => { setTimeout(res, 500); });
    // Only show alerts for positive values and if the alert should be "shown".
    const { amount, total, showAlert } = this.alertList[0];
    nodecg.sendMessage(
      'donationAlertsLogging',
      `alert - amount: ${amount}, total: ${total}, showAlert: ${showAlert}`,
    );
    if (amount && amount > 0 && showAlert) {
      nodecg.sendMessage('omnibarPlaySound', { amount });
      // await this.sfx.play();
      await new Promise((res) => { setTimeout(res, 500); });
      this.showAlert = true;
      this.alertText = formatUSD(amount);
    }
    const totalToAnimateTo = total ?? (this.total + (amount ?? 0));
    nodecg.sendMessage('donationAlertsLogging', `decided we should animate to ${totalToAnimateTo}`);
    gsap.to(this, {
      total: totalToAnimateTo,
      duration: 5,
    });
    await new Promise((res) => { setTimeout(res, 6000); });
    this.alertList.shift();
    this.showAlert = false;
    if (this.alertList.length) this.playNextAlert();
    // Checks the currently set total against the raw replicant total.
    // If they don't line up, just queue up another "alert" to adjust it.
    else if (this.total !== this.rawTotal) {
      nodecg.sendMessage(
        'donationAlertsLogging',
        'totals do not match at end of queue, pushing another total alert '
          + `(was ${this.total}, should be ${this.rawTotal})`,
      );
      clearTimeout(this.donationTotalTimeout); // Clearing here for safety
      this.alertList.push({
        total: this.rawTotal,
        showAlert: false,
      });
      this.playNextAlert();
    } else {
      nodecg.sendMessage('donationAlertsLogging', 'queue ended');
      this.playingAlerts = false;
    }
    this.$emit('totalUpdate', totalToAnimateTo);
  }

  async created(): Promise<void> {
    this.total = this.rawTotal;
    nodecg.listenFor('donationTotalUpdated', (data: { total: number }) => {
      // If after 10s this hasn't been cleared by a new donation, update the total with it.
      this.donationTotalTimeout = window.setTimeout(() => {
        nodecg.sendMessage('donationAlertsLogging', 'donationTotalTimeout triggered');
        // Double check if the total really needs updating.
        // Also, only queue if alerts are not already
        // (the play system will check the final total at the end anyway).
        const completeTotal = round(data.total + this.additionalDonationsAmount, 2);
        if (!this.playingAlerts && completeTotal !== this.total) {
          nodecg.sendMessage(
            'donationAlertsLogging',
            'donationTotalTimeout decided we should push a new total as an alert',
          );
          this.alertList.push({
            total: completeTotal,
            showAlert: false,
          });
          if (!this.playingAlerts) this.playNextAlert(true);
        }
      }, 10 * 1000);
    });
    nodecg.listenFor('newDonation', (data: { amount: number }) => {
      clearTimeout(this.donationTotalTimeout);
      this.alertList.push({
        amount: data.amount,
        showAlert: true,
      });
      if (!this.playingAlerts) this.playNextAlert(true);
    });
    nodecg.listenFor('additionalDonationToggle', (data: { key: string, active: boolean }) => {
      const donation = this.additionalDonationsMapped.find((d) => d.key === data.key);
      if (donation) {
        this.alertList.push({
          amount: (data.active ? 1 : -1) * donation.amount,
          showAlert: data.active,
        });
        if (!this.playingAlerts) this.playNextAlert(true);
      }
    });
    this.$emit('totalUpdate', this.total);
  }
}
</script>

<style scoped>
  #Total {
    /*padding: 0 13px 0 0;*/
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
    /*padding-left: 10px;*/
    background: unset !important;
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
