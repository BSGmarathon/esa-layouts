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
      <countdown :style="{ 'margin-top': '50px' }" />

      <div class="musicContainer">
        <music-track hide-icon class="music" />
      </div>
    </div>

    <div class="Flex winOverlay" :style="{
      opacity: remaining > 0 ? '0' : '1',
    }">
      <div class="FlexColumn overlayInner">
        <p>Event Starts Soon</p>
        <div ref="spinner" class="spinner" />
        <p>Don't turn off your computer</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Countdown from '@shared/graphics/countdown';
import { Component, Ref, Vue } from 'vue-property-decorator';
import { Countdown as CountdownType } from '@shared/types/schemas';
import MusicTrack from '@esa-layouts/graphics/intermission/components/MusicTrack.vue';
import { State } from 'vuex-class';
import { getZoomAmountCSS } from '../_misc/helpers';

@Component({
  components: {
    Countdown,
    MusicTrack,
  },
})
export default class extends Vue {
  @State countdown!: CountdownType;
  @Ref('spinner') spinner!: HTMLElement;

  zoom = getZoomAmountCSS();

  get remaining() {
    return this.countdown?.remaining ?? 0;
  }

  created(): void {
    // let frame = 0xE100;
    let frame = 0xE052;
    const animFn = () => {
      // eslint-disable-next-line no-plusplus
      this.spinner.innerHTML = String.fromCharCode(frame++);

      // if (frame >= 0xE176) {
      //   frame = 0xE100;
      // }

      if (frame >= 0xE0CB) {
        frame = 0xE052;
      }
    };

    let last = performance.now();

    const tick = () => {
      if (performance.now() - last >= 22) {
        animFn();

        last = performance.now();
      }
      requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: windows;
  src: url(./segoe_slboot.ttf) format('truetype');
}

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
    }
  }
}

.winOverlay {
  opacity: 0;
  background: #00a2ed;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s linear;

  .overlayInner {
    color: white;
    text-align: center;
    font-size: 3em;
    display: inline-flex;
    justify-self: center;
    align-content: center;

    .spinner {
      font-family: windows;
      font-size: 1.5em;
    }
  }
}

.musicContainer {
  position: relative;
  width: 672px;
  height: 100px;
  left: 484px;
  top: 200px;
  font-size: 20px;
  //background: rgba(255, 255, 255, 0.5);
}
</style>
