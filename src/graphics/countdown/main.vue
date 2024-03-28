<template>
  <div id="Countdown" class="Flex" :style="{ zoom }">
    <div id="Background" />
    <div
      id="Layout"
      class="Flex bsglayout countdownLayout"
      :style="{
        'flex-direction': 'column',
        height: '100%',
      }"
    >
      <countdown class="textOrangeShadow" :style="{ 'margin-top': '50px' }" />

      <div class="game-container">
        <game/>
      </div>

      <div class="musicContainer">
        <music-track hide-icon class="music" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Countdown from '@shared/graphics/countdown';
import { Component, Vue } from 'vue-property-decorator';
import { Countdown as CountdownType } from '@shared/types/schemas';
import MusicTrack from '@esa-layouts/graphics/intermission/components/MusicTrack.vue';
import { State } from 'vuex-class';
import Game from './game/game.vue';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    Countdown,
    MusicTrack,
    Game,
  },
})
export default class extends Vue {
  @State countdown!: CountdownType;

  zoom = getZoomAmountCSS();
}
</script>

<style lang="scss">
#Countdown {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  #Layout {
    position: relative;
    justify-content: center;
    align-items: center;

    div div:last-child {
      margin-top: 0 !important;
      letter-spacing: .5rem;
    }
  }
}

.game-container {
  position: absolute;
  left: 27px;
  top: 600px;
}

.musicContainer {
  position: absolute;
  width: 672px;
  height: 100px;
  left: 57px;
  top: 148px;
  font-size: 20px;
  //background: rgba(0, 0, 0, 0.5);
}
</style>
