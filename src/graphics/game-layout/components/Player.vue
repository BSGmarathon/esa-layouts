<script setup lang="ts">
import { NameCycle } from '@esa-layouts/types/schemas';
import fitty, { FittyInstance } from 'fitty';
import { RunDataPlayer, RunDataTeam } from 'speedcontrol-util/types';
import { useReplicant } from 'nodecg-vue-composable';
import { computed, ref, onMounted, onUnmounted, useTemplateRef, watch, nextTick } from 'vue';
import { runDataActiveRun } from '@esa-layouts/browser_shared/replicant_store';

const { slotNo } = defineProps<{ slotNo?: number }>();

const playerElem = useTemplateRef<HTMLElement>('Player');
const nameCycleServer = useReplicant<NameCycle>('nameCycle', 'esa-layouts')!;
const runData = computed(() => runDataActiveRun.value);
const team = ref<RunDataTeam | null>(null);
const player = ref<RunDataPlayer | null>(null);
const playerIndex = ref(0);
const nameCycle = ref(0);
let fittyPlayer: FittyInstance | undefined; // "Local" name cycle used so we can let flags load.
const pronouns = computed(() => player.value?.pronouns);
const coop = computed(
  () => (runData.value && runData.value.teams.length === 1 && runData.value.teams[0].players.length > 1)
    || false,
);

function updateTeam(): void {
  // Makes a fake team with just 1 player in it for coop/relay.
  if (runData.value?.relay) {
    const localTeam = runData.value?.teams[slotNo ?? 0];
    const localPlayer = localTeam?.players.find((p) => p.id === localTeam.relayPlayerID);

    team.value = localPlayer ? { name: localTeam.name, id: localPlayer.id, players: [localPlayer] } : null;
  } else if (typeof slotNo === 'number' && coop.value) {
    const localTeam = runData.value?.teams[0];
    const localPlayer = localTeam?.players[slotNo];

    team.value = localTeam && localPlayer ? { name: localTeam.name, id: localPlayer.id, players: [localPlayer] } : null;
  } else {
    team.value = runData.value?.teams[slotNo || 0] || null;
  }
}

async function preloadFlag(targetPlayer: RunDataPlayer | null): Promise<void> {
  if (!targetPlayer || !targetPlayer.country) {
    return;
  }

  await new Promise<void>((res) => {
    const img = new Image();
    const setAsLoaded = (): void => {
      img.removeEventListener('load', setAsLoaded);
      img.removeEventListener('error', setAsLoaded);
      res();
    };
    img.addEventListener('load', setAsLoaded);
    img.addEventListener('error', setAsLoaded);
    img.src = `/bundles/esa-layouts/flags/${targetPlayer.country}.png`;
  });
}

async function updatePlayer(): Promise<void> {
  const localPlayer = (team.value ? team.value.players[playerIndex.value] : null) || null;
  await preloadFlag(localPlayer);
  nameCycle.value = nameCycleServer.data!;
  player.value = localPlayer;
}

function fit(): void {
  const elem = playerElem.value;

  if (elem) {
    [fittyPlayer] = fitty('.PlayerText', {
      minSize: 1,
      maxSize: parseInt(elem.style.fontSize, 10),
      multiLine: false,
    });
  }
}

watch(() => runData.value, async (newVal, oldVal) => {
  const newPlayers = newVal?.teams[slotNo || 0]?.players;
  const oldPlayers = oldVal?.teams[slotNo || 0]?.players;

  if (newVal?.id !== oldVal?.id || newPlayers?.length !== oldPlayers?.length) {
    playerIndex.value = 0;
  }

  updateTeam();
  updatePlayer();
  await nextTick();
  fit();
});

watch(() => nameCycleServer.data!, async (newVal, oldVal) => {
  // If the name cycle resets, we need to move to the next player if applicable.
  if (newVal < oldVal) {
    if (team.value && team.value.players.length - 1 > playerIndex.value) {
      playerIndex.value += 1;
    } else {
      playerIndex.value = 0;
    }
    updatePlayer();
  } else if (oldVal < newVal) {
    nameCycle.value = newVal; // Set "local" name cycle if cycle has only progressed.
  }

  await nextTick();
  fit();
});

onMounted(async () => {
  updateTeam();
  await updatePlayer();

  fit();
});

onUnmounted(() => {
  if (fittyPlayer) {
    fittyPlayer.unsubscribe();
  }
});
</script>

<template>
  <div
    v-if="player"
    ref="Player"
    class="FlexPlayer Player FlexCenter"
    :style="{
      'justify-content': 'space-between',
      'font-weight': 300,
      width: '100%',
      height: '45px',
      padding: '0px',
      'margin-top': 'auto',
      'margin-bottom': 'auto',
      'box-sizing': 'border-box',
    }"
  >

    <!-- Player/Twitch Icon -->
    <div
      :style="{
        position: 'relative',
        height: '100%',
        display: 'flex',
        'flex-direction': 'row',
      }"
    >
      <transition name="fade">
        <img
          v-if="nameCycle === 1 && player.social.twitch"
          key="twitch"
          class="Icon NormalIcon"
          :style="{
            //
          }"
          src="../../_misc/bsgIcons/twitch-icon.png"
        >
        <img
          v-else-if="nameCycle === 1 && player.social.youtube"
          key="twitch"
          class="Icon NormalIcon"
          :style="{
            //
          }"
          src="../../_misc/bsgIcons/youtube-icon.png"
        >
        <!--<template v-else-if="!coop && typeof slotNo === 'number'">
          <img
            v-if="slotNo === 0"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon1.png"
          >
          <img
            v-else-if="slotNo === 1"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon2.png"
          >
          <img
            v-else-if="slotNo === 2"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon3.png"
          >
          <img
            v-else-if="slotNo === 3"
            key="name"
            class="Icon"
            src="../../_misc/PlayerIcon4.png"
          >
        </template>
        <img
          v-else
          key="name"
          class="Icon"
          src="../../_misc/PlayerIconSolo.png"
        >-->
      </transition>
    </div>

    <!-- Player Name/Twitch -->
    <div
      class="FlexPlayer FlexCenter"
      :style="{
        width: 'calc(100% - 130px)',
        height: '100%',
        'align-items': 'center',
        'align-content': 'center',
        'justify-content': 'center',
        'font-size': '20pt',
        'font-weight': 600,
        'font-family': 'Bahnschrift',
      }"
    >
      <transition name="fade">
        <div
          v-if="nameCycle === 1 && (player.social.twitch || player.social.youtube)"
          key="twitch"
          class="FlexPlayer TextWrapper"
        >
          <div class="PlayerText">
            <span
              v-if="team && team.name"
              :style="{ 'font-size': '1.15em', 'font-weight': 600 }"
            >
              {{ team.name }}:
            </span>
            {{ player.social.twitch ?? player.social.youtube }}
            <!-- Custom Title code repeated twice, needs cleaning up! -->
            <!-- No need for pronouns during twitch -->
            <!-- <span
              v-if="pronouns"
              class="Pronouns"
              :style="{
                padding: '4px',
                'margin-left': '5px',
              }"
            >
              {{ pronouns }}
            </span> -->
          </div>
        </div>
        <div
          v-else
          key="name"
          class="FlexPlayer TextWrapper"
        >
          <div class="PlayerText">
            <span
              v-if="team?.name"
              :style="{ 'font-size': '1.15em', 'font-weight': 600 }"
            >
              {{ team.name }}:
            </span>
            {{ player.name }}
            <!-- Custom Title code repeated twice, needs cleaning up! -->
            <span
              v-if="pronouns"
              class="Pronouns"
              :style="{
                padding: '4px',
                'margin-left': '5px',
              }"
            >
              {{ pronouns }}
            </span>
          </div>
        </div>
      </transition>
    </div>

    <!-- Country Flag -->
    <div
      class="FlexColumn"
      :style="{
        'justify-content': 'center',
        position: 'relative',
        height: '100%',
      }"
    >
      <transition name="fade">
        <img
          v-if="player.country"
          :key="player.country"
          class="Flag"
          :src="player.country ? `/bundles/esa-layouts/flags/${player.country}.png` : ''"
          :style="{
            position: 'relative',
            right: '7px',
            // width: '52px',
            height: '28px',
            'align-self': 'center',
            'border-width': '2px',
            'border-style': 'solid',
            opacity: player.country ? 1 : 0,
          }"
        >
      </transition>
      <!-- TODO: I could do this, but it causes a lot of style issues -->
<!--      <transition name="fade">
        <span
          v-if="pronouns"
          class="Pronouns"
          :style="{
            padding: '4px',
            'margin-left': '5px',
          }"
        >
          {{ pronouns }}
        </span>
      </transition>-->
    </div>
  </div>
</template>

<style scoped>
.Icon {
  height: 100%;
  position: absolute;
}

.TextWrapper {
  width: auto;
  height: 100%;
  position: absolute;
}

.PlayerText {
  height: 30px;
}

.Player .Pronouns,
.Pronouns {
  display: inline;
  font-size: 12pt;
  height: 19px;
}

.PlayerAudioLive {
  position: absolute;
  left: 460px;
  /*margin-right: 10px;*/
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
