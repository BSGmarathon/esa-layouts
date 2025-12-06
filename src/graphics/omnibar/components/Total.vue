<script setup lang="ts">
import { additionalDonations, donationTotal } from '@esa-layouts/browser_shared/replicant_store';
import { formatUSD } from '@esa-layouts/graphics/_misc/helpers';
import gsap from 'gsap';
import { round } from 'lodash';
import { computed, onMounted, ref } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';

const emit = defineEmits<{
  totalUpdate: [newTotal: number],
}>();
const total = ref(0);
const playingAlerts = ref(false);
const showAlert = ref(false);
const alertText = ref('€0');
const alertList: { total?: number, amount?: number, showAlert: boolean }[] = [];
let donationTotalTimeout: number | undefined;
const additionalDonationsCfg = nodecg.bundleConfig.additionalDonations;

const additionalDonationsMapped = computed(
  () => additionalDonationsCfg.map((d) => ({
    key: d.key,
    description: d.description,
    amount: d.amount,
    active: additionalDonations.data?.find((a) => a.key === d.key)?.active ?? false,
  })),
);
const additionalDonationsAmount = computed(
  () => additionalDonationsMapped.value.filter((d) => d.active).reduce((partialSum, a) => partialSum + a.amount, 0),
);
const rawTotal = computed(
  () => round((donationTotal.data ?? 0) + additionalDonationsAmount.value, 2),
);

const totalStr = computed(() => formatUSD(total.value));

async function playNextAlert(start = false): Promise<void> {
  nodecg.sendMessage('donationAlertsLogging', `playNextAlert called (start: ${start})`);
  clearTimeout(donationTotalTimeout); // Clearing here for safety
  playingAlerts.value = true;
  if (!start) await new Promise((res) => { setTimeout(res, 500); });
  // Only show alerts for positive values and if the alert should be "shown".
  const { amount, total: totalAlert, showAlert: showAlertList } = alertList[0];
  nodecg.sendMessage(
    'donationAlertsLogging',
    `alert - amount: ${amount}, total: ${totalAlert}, showAlert: ${showAlertList}`,
  );
  if (amount && amount > 0 && showAlertList) {
    nodecg.sendMessage('omnibarPlaySound', { amount });
    await new Promise((res) => {
      setTimeout(res, 500);
    });
    showAlert.value = true;
    alertText.value = formatUSD(amount);
  }
  const totalToAnimateTo = totalAlert ?? (total.value + (amount ?? 0));
  nodecg.sendMessage('donationAlertsLogging', `decided we should animate to ${totalToAnimateTo}`);
  gsap.to(total, {
    value: totalToAnimateTo,
    duration: 5,
  });
  await new Promise((res) => {
    setTimeout(res, 6000);
  });
  alertList.shift();
  showAlert.value = false;
  if (alertList.length) playNextAlert();
  // Checks the currently set total against the raw replicant total.
  // If they don't line up, just queue up another "alert" to adjust it.
  else if (total.value !== rawTotal.value) {
    nodecg.sendMessage(
      'donationAlertsLogging',
      'totals do not match at end of queue, pushing another total alert '
      + `(was ${total.value}, should be ${rawTotal.value})`,
    );
    clearTimeout(donationTotalTimeout); // Clearing here for safety
    alertList.push({
      total: rawTotal.value,
      showAlert: false,
    });
    playNextAlert();
  } else {
    nodecg.sendMessage('donationAlertsLogging', 'queue ended');
    playingAlerts.value = false;
  }
  emit('totalUpdate', totalToAnimateTo);
}

nodecg.listenFor('donationTotalUpdated', (data: { total: number }) => {
  const completeTotal = round(data.total + additionalDonationsAmount.value, 2);
  if (!playingAlerts.value && completeTotal !== total.value) {
    nodecg.sendMessage(
      'donationAlertsLogging',
      'donationTotalTimeout decided we should push a new total as an alert',
    );
    alertList.push({
      total: completeTotal,
      amount: completeTotal - total.value,
      showAlert: true,
    });
    if (!playingAlerts.value) playNextAlert(true);
  }
});

nodecg.listenFor('newDonation', (data: { amount: number }) => {
  clearTimeout(donationTotalTimeout);
  alertList.push({
    amount: data.amount,
    showAlert: true,
  });
  if (!playingAlerts.value) playNextAlert(true);
});

nodecg.listenFor('additionalDonationToggle', (data: { key: string, active: boolean }) => {
  const donation = additionalDonationsMapped.value.find((d) => d.key === data.key);
  if (donation) {
    alertList.push({
      amount: (data.active ? 1 : -1) * donation.amount,
      showAlert: data.active,
    });
    if (!playingAlerts.value) playNextAlert(true);
  }
});

onMounted(async () => {
  await waitForReplicant(donationTotal);

  total.value = rawTotal.value;

  emit('totalUpdate', total.value);
});
</script>

<template>
  <div class="Flex">
    <div class="arrow_base right dash_seg_2" />
    <div class="arrow_base right dash_seg_1" />
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
      left: '180px',
      'z-index': 99999999999,
    }">
      <div
        v-if="alertList[0]"
        :style="{
              'z-index': 1,
              opacity: showAlert ? 1 : 0,
              // opacity: 1,
              transition: 'opacity 0.5s',
          }"
        class="Flex coin-thing"
      >
        <img
          src="./img/RetroCoin.png"
          :style="{ height: '50px', 'image-rendering': 'pixelated', 'margin-right': '5px' }"
        />
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
              {{ alertList[0] ? alertList[0].amount?.toFixed(2) : '€0' }}
            </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../dash-helpers";

#Total {
  font-variant-numeric: tabular-nums;
  font-size: 40px;
  font-weight: 500;
  text-align: center;
  //height: 82px;

  padding-left: 50px;
  padding-right: 50px;

  background: var(--bsg-color);

  --arrow-setting: 55px;
  clip-path: polygon(
      100% 0%,
      100% 50%,
      100% 100%,
      var(--arrow-setting) 100%,
      20px 50%,
      var(--arrow-setting) 0%
  );

  // Move the little shit over 1 px to fix a gap
  left: 1px;
  position: relative;
}

.dash_seg_1 {
  --color: var(--dark-arrow-default);
  right: -80px;
}

.dash_seg_2 {
  --color: var(--bsg-color);
  right: -144px;
}

/* Each character in the total is in a span; setting width so the numbers appear monospaced. */
#Total > span {
  width: 0.50em;
  color: white;
  padding-top: 18px;
  display: inline-block;
  text-align: center;
  background: var(--bsg-color);
  //background: cornflowerblue;
  position: relative;
}

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
  /* .component-fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}
</style>
