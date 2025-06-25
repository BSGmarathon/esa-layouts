<script setup lang="ts">
import { donationsToRead, streamDeckData, timer } from '@esa-layouts/browser_shared/replicant_store';
import { FlagCarrier } from '@esamarathon/mq-events/types';
import { computed, onMounted, ref } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import { useHead } from '@vueuse/head';

useHead({ title: 'Player HUD' });

const tagScanned = ref<'success_comm' | 'success_player' | 'fail_player' | boolean>(false);
const scannedData = ref<FlagCarrier.TagScanned | null>(null);
let messageTimeout: number | undefined;
const therunggMessage = ref<string | null>(null);

const largestDonation = computed(() => `€${donationsToRead.data!
  .reduce((prev, current) => ((prev > current.amount) ? prev : current.amount), 0)
  .toFixed(2)}`);

const tagDisplayName = computed(() => {
  if (!scannedData.value) {
    return '';
  }

  return scannedData.value.raw.pronouns
    ? `${scannedData.value.user.displayName} (${scannedData.value.raw.pronouns})`
    : scannedData.value.user.displayName;
});

const buttonId = computed(() => scannedData.value?.flagcarrier?.id || '');

const alertClass = computed(() => {
  if (tagScanned.value) {
    switch (tagScanned.value) {
      case 'success_comm':
      case 'success_player':
        return 'TagSuccess';
      case 'fail_player':
        return 'TagFail';
      default:
        return 'TagNothing';
    }
  }

  if (streamDeckData.data!.playerHUDTriggerType === 'message') {
    return 'MessageToRead';
  }

  if (donationsToRead.data!.length) {
    return 'DonationsToRead';
  }

  return '';
});

onMounted(async () => {
  await NodeCG.waitForReplicants(timer);
  await waitForReplicant(donationsToRead, streamDeckData);

  nodecg.listenFor(
    'bigbuttonTagScanned',
    ({ state, data }: {
      state?: 'success_comm' | 'success_player' | 'fail_player',
      data: FlagCarrier.TagScanned,
    }) => {
      window.clearTimeout(messageTimeout);
      therunggMessage.value = null;
      tagScanned.value = state || true;
      scannedData.value = data;
      messageTimeout = window.setTimeout(() => {
        tagScanned.value = false;
        scannedData.value = null;
      }, 7000);
    },
  );

  nodecg.listenFor('therunggMessage', (msg: string) => {
    window.clearTimeout(messageTimeout);
    tagScanned.value = false;
    scannedData.value = null;
    therunggMessage.value = msg;
    messageTimeout = window.setTimeout(() => {
      therunggMessage.value = null;
    }, 10 * 1000);
  });
});
</script>

<template>
  <div
    class="Flex"
    :style="{
      'flex-direction': 'column',
      'width': '100vw',
      'height': '100vh',
    }"
  >
    <!-- Main messages. -->
    <div
      :class="`PlayerHUD Flex ${alertClass}`"
      :style="{
        width: '100%',
        'flex-grow': 1,
        'flex-direction': 'column',
        'box-sizing': 'border-box',
        'padding': '30px 5vw',
        'transition': 'background-color 1s',
        'text-align': 'center',
        'font-size': '11vh',
      }"
    >
      <template v-if="therunggMessage">
        <span :style="{ 'font-size': '0.6em' }">therun.gg Message:</span>
        {{ therunggMessage }}
      </template>
      <!-- Tag scanning messages. -->
      <template v-else-if="tagScanned">
        <template v-if="tagScanned === 'success_comm'">
          <div>✔</div>
          <div>
            <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
            scanned in as commentator
          </div>
        </template>
        <template v-else-if="tagScanned === 'success_player'">
          <div>✔</div>
          <div>
            <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
            scanned in as player on
            <span :style="{ 'white-space': 'nowrap' }">button {{ buttonId }}!</span>
          </div>
        </template>
        <template v-else-if="tagScanned === 'fail_player'">
          <div>❌</div>
          <div>
            <span :style="{ 'font-weight': 600 }">{{ tagDisplayName }}</span>
            cannot scan in as player on
            <span :style="{ 'white-space': 'nowrap' }">button {{ buttonId }}!</span>
          </div>
        </template>
        <template v-else>
          <div>❔</div>
          <div>Tag was scanned but not needed</div>
        </template>
      </template>
      <!-- Manually triggered message from readers via Stream Deck. -->
      <template v-else-if="streamDeckData.data?.playerHUDTriggerType === 'message'">
        Any time
        <br/>for messages?
      </template>
      <!-- Donations to be read message. -->
      <template v-else-if="donationsToRead.data?.length">
        Donations Pending:
        <br/>{{ donationsToRead.data.length }}
        <br/>Largest Unread Donation: {{ largestDonation }}
      </template>
      <!-- Nothing. -->
      <template v-else>
        Nothing currently
        <br/>to be read
      </template>
    </div>
    <!-- Timer -->
    <div
      :style="{
        background: 'black',
        color: 'white',
        width: '100%',
        'text-align': 'center',
        'font-size': '6vh',
        'padding-bottom': '1vh',
        'padding-top': '30px',
      }"
    >
      {{ timer.value!.time }}
    </div>
  </div>
</template>

<style>
  .PlayerHUD {
    background-color: black;
    color: white;
    text-shadow: 4px 4px 1px black;
  }

  *[class*='Tag'] {
    font-size: 15vh;
  }
  .TagSuccess {
    background-color: rgb(255, 7, 11);
  }
  .TagFail, .TagNothing {
    background-color: rgb(148, 0, 0);
  }

  .DonationsToRead {
    background-color: green;
  }

  .MessageToRead {
    background-color: rgb(255, 208, 0);
    color: black;
    text-shadow: unset;
    font-weight: 600;
  }
</style>
