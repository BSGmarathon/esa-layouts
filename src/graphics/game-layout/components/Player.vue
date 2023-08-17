<template>
  <div
    v-if="player"
    ref="Player"
    class="FlexPlayer Player FlexCenter"
    :style="{
      'justify-content': 'space-between',
      'font-weight': 500,
      width: '90%',
      height: '48px',
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
        'margin-left': '10px',
      }"
    >
      <transition name="fade">
        <div key="audioLive"
             class="PlayerAudioLive Icon NormalIcon"
             style="width: 36px; height: 36px;" v-if="showSpeakerIcon" />
      </transition>
      <transition name="fade">
        <img
          v-if="nameCycle === 1 && player.social.twitch"
          key="twitch"
          class="Icon"
          :style="{
            'position': 'relative',
          }"
          src="../../_misc/TwitchIcon.png"
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
      'font-size': '25px',
        position: 'relative',
        width: 'calc(100% - 130px)',
        height: '100%',
        'align-items': 'flex-start',
        'display': 'flex',
        'top': '2px',
        'justify-content': 'center',
        'flex': '1',
        'white-space': 'no-wrap',
        'padding-right': '80px',
        'font-weight': '600',
        'font-family': 'Goodlight',
      }"
    >
      <transition name="fade">
        <div
          v-if="nameCycle === 1 && player.social.twitch"
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
            /{{ player.social.twitch }}
            <!-- Custom Title code repeated twice, needs cleaning up! -->
            <!-- No need for pronouns during twitch -->
<!--            <span
              v-if="pronouns"
              class="Pronouns"
              :style="{
                padding: '3px 5px',
                'margin-left': '5px',
              }"
            >
              {{ pronouns }}
            </span>-->
          </div>
        </div>
        <div
          v-else
          key="name"
          class="FlexPlayer TextWrapper"
        >
          <div class="PlayerText">
            <span
              v-if="team.name"
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
                padding: '3px 5px',
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
      :style="{
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
            position: 'absolute',
            right: '7px',
            height: 'calc(100% - 4px)',
            'border-width': '2px',
            'border-style': 'solid',
            opacity: player.country ? 1 : 0,
          }"
        >
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelDataReplicant as ChanData } from '@esa-layouts/types/replicant-types';
import { GameLayouts, NameCycle } from '@esa-layouts/types/schemas';
import fitty, { FittyInstance } from 'fitty';
import { RunDataActiveRun, RunDataPlayer, RunDataTeam } from 'speedcontrol-util/types';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;
  @State('gameLayouts') gameLayouts!: GameLayouts;
  @State('nameCycle') nameCycleServer!: NameCycle;
  @State('x32GameAudio') x32GameAudio!: ChanData[];
  @State coop!: boolean;
  @Prop(Number) slotNo!: number;
  team: RunDataTeam | null = null;
  player: RunDataPlayer | null = null;
  playerIndex = 0;
  nameCycle = 0; // "Local" name cycle used so we can let flags load.
  fittyPlayer: FittyInstance | undefined;
  showSpeakerIcon = false;

  get pronouns(): string | undefined {
    return this.player?.pronouns;
  }

  updateTeam(): void {
    // Makes a fake team with just 1 player in it for coop/relay.
    if (this.runData?.relay) {
      const team = this.runData?.teams[this.slotNo ?? 0];
      const player = team?.players.find((p) => p.id === team.relayPlayerID);
      this.team = player ? { name: team.name, id: player.id, players: [player] } : null;
    } else if (typeof this.slotNo === 'number' && this.coop) {
      const team = this.runData?.teams[0];
      const player = team?.players[this.slotNo];
      this.team = team && player ? { name: team.name, id: player.id, players: [player] } : null;
    } else {
      this.team = this.runData?.teams[this.slotNo || 0] || null;
    }
  }

  async preloadFlag(player: RunDataPlayer | null): Promise<void> {
    if (!player || !player.country) {
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
      img.src = `/bundles/esa-layouts/flags/${player.country}.png`;
    });
  }

  async updatePlayer(): Promise<void> {
    const player = (this.team ? this.team.players[this.playerIndex] : null) || null;
    await this.preloadFlag(player);
    this.nameCycle = this.nameCycleServer;
    this.player = player;
  }

  fit(): void {
    const elem = this.$refs.Player as HTMLElement;
    if (elem) {
      [this.fittyPlayer] = fitty('.PlayerText', {
        minSize: 1,
        maxSize: parseInt(elem.style.fontSize, 10),
        multiLine: false,
      });
    }
  }

  created(): void {
    this.updateTeam();
    this.updatePlayer().then(() => {
      // initial setting of the icon
      this.onX32GameAudioChange(this.x32GameAudio);
    });
  }

  mounted(): void {
    this.fit();
  }

  destroyed(): void {
    if (this.fittyPlayer) {
      this.fittyPlayer.unsubscribe();
    }
  }

  @Watch('x32GameAudio')
  onX32GameAudioChange(newVal: ChanData[]): void {
    if (this.gameLayouts!.selected!.endsWith('1p')) {
      this.showSpeakerIcon = false;
      return;
    }

    let chosenSlot = this.slotNo || 0;

    if (this.player && this.player.customData.audioChannelOverride) {
      let overrideChannel = parseInt(this.player.customData.audioChannelOverride, 10);

      if (overrideChannel > 0) {
        overrideChannel -= 1;
      }

      chosenSlot = Math.max(0, Math.min(3, overrideChannel));
    }

    const mixerConfig = newVal[chosenSlot];

    this.showSpeakerIcon = !mixerConfig.muted && mixerConfig.faderUp;
  }

  @Watch('runData')
  async onRunDataChange(newVal: RunDataActiveRun, oldVal?: RunDataActiveRun): Promise<void> {
    // Only reset the player if run is changed or player length is different.
    const newPlayers = newVal?.teams[this.slotNo || 0]?.players;
    const oldPlayers = oldVal?.teams[this.slotNo || 0]?.players;
    if (newVal?.id !== oldVal?.id || newPlayers?.length !== oldPlayers?.length) {
      this.playerIndex = 0;
    }
    this.updateTeam();
    this.updatePlayer();
    await Vue.nextTick();
    this.fit();
    this.onX32GameAudioChange(this.x32GameAudio);
  }

  @Watch('nameCycleServer')
  async onNameCycleChange(newVal: NameCycle, oldVal: NameCycle): Promise<void> {
    // If the name cycle resets, we need to move to the next player if applicable.
    if (newVal < oldVal) {
      if (this.team && this.team.players.length - 1 > this.playerIndex) {
        this.playerIndex += 1;
      } else {
        this.playerIndex = 0;
      }
      this.updatePlayer();
    } else if (oldVal < newVal) {
      this.nameCycle = newVal; // Set "local" name cycle if cycle has only progressed.
    }
    await Vue.nextTick();
    this.fit();
  }
}
</script>

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

  .PlayerAudioLive {
    position: relative;
    margin-right: 10px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
