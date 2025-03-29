<script setup lang="ts">
import { lowerThird } from '@esa-layouts/browser_shared/replicant_store';
import gsap from 'gsap';
import { onMounted, ref } from 'vue';
import { useHead } from '@vueuse/head';
import { wait } from '../_misc/helpers';

useHead({ title: 'Lower third' });

const showNames = ref(true);
const barVisible = ref(true);
const barWidth = ref(90);
const barOpenState = 90;
const barClosedState = 9;

function setTransitioning(state: boolean): void {
  lowerThird.data!.transitioning = state;
  lowerThird.save();
}

function setVisible(state: boolean): void {
  lowerThird.data!.visible = state;
  lowerThird.save();
}

async function show(): Promise<void> {
  setTransitioning(true);
  barVisible.value = true;
  await wait(500); // --lt-up-down-anim-dur
  gsap.to(barWidth, {
    value: barOpenState,
    duration: 1,
    ease: 'back.out(1.7)',
  });
  // little shorter here cuz it looks cool
  await wait(800);
  showNames.value = true;
  await wait(250); // --lt-names-show-hide-anim-dur
  setTransitioning(false);
  setVisible(true);
}

async function hide(): Promise<void> {
  setTransitioning(true);
  showNames.value = false;
  await wait(100); // --lt-names-show-hide-anim-dur - 150 cuz looks cool
  // docs: https://greensock.com/ease-visualizer/
  gsap.to(barWidth, {
    value: barClosedState,
    duration: 1,
    ease: 'back.in(1.7)',
  });
  await wait(1050);
  barVisible.value = false;
  await wait(500); // --lt-up-down-anim-dur
  setTransitioning(false);
  setVisible(false);
}

function toggle(): void {
  if (barVisible.value) {
    hide();
  } else {
    show();
  }
}

onMounted(async () => {
  while (!lowerThird?.data) {
    await wait(100);
  }

  if (lowerThird.data.visible) {
    barVisible.value = true;
    showNames.value = true;
    barWidth.value = barOpenState;
  } else {
    barVisible.value = false;
    showNames.value = false;
    barWidth.value = barClosedState;
  }

  nodecg.listenFor('lower-third:show', async ({ autoHide, showForSecs }) => {
    await show();

    if (autoHide) {
      await wait(showForSecs * 1000);
      await hide();
    }
  });
  nodecg.listenFor('lower-third:hide', () => hide());
});
</script>

<template>
  <div>
    <transition name="lower-third">
      <div class="lowe-third-wrapper" v-if="barVisible" >
        <div class="lower-third" :style="{
        'width': `${barWidth}%`,
       }">
          <!-- NOTE: we cannot animate left and right due to the before pos of the dash -->
          <!-- It'll overflow -->
          <div class="left">
            <div class="box"/>
          </div>
          <transition name="names">
            <div class="names" v-if="showNames">
          <span v-for="(name, i) in lowerThird.names"
                :key="i">{{ name }}</span>
            </div>
          </transition>
          <div class="right">
            <div class="box"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
@import "animate.css";

html, body {
  padding: 0;
  margin: 0;
}

* {
  --lt-height: 60px;

  // animation settings
  --lt-up-down-anim-dur: 500ms;
  --lt-names-show-hide-anim-dur: 250ms;
}

.box {
  z-index: 99;
}

.lowe-third-wrapper {
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: center;
  bottom: 150px;
}

.lower-third {
  display: flex;
  //position: fixed;
  position: relative;
  // max-width: 90%;
  width: 90%;
  //margin-left: 5%;
  height: var(--lt-height);

  background: linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%);

  .left {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: var(--lt-height);
    background: var(--slide-color);;

    .box:before {
      content: '';
      position: absolute;
      background: url('./assets/left_dash_crop.png') center center;
      background-size: cover;
      height: var(--lt-height);
      width: 106px;
      left: 50px;
      top: 0;
    }
  }

  .names {
    position: relative;
    display: flex;
    align-content: space-around;
    justify-content: space-evenly;
    align-items: baseline;
    color: white;
    font-size: 26px;
    width: 100%;
    padding-top: 13px;

    z-index: 1;
    overflow: hidden;

    p {
      flex-grow: 0;
      align-self: center;
    }
  }

  .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 50px;
    height: var(--lt-height);
    background: var(--slide-color);

    .box:before {
      content: '';
      position: absolute;
      background: url('./assets/right_dash.png') center center;
      background-size: cover;
      height: var(--lt-height);
      width: 104px;
      left: -103px;
      top: 0;
    }
  }
}

.lower-third-leave-active {
  animation: backOutDown;
  animation-duration: var(--lt-up-down-anim-dur);
  animation-timing-function: ease-in-out;
}

.lower-third-enter-active {
  animation: backInUp;
  animation-duration: var(--lt-up-down-anim-dur);
  animation-timing-function: ease-in-out;
}

.names-enter-active {
  animation: fadeInUp;
  animation-duration: var(--lt-names-show-hide-anim-dur);
  animation-timing-function: ease-in-out;
}

.names-leave-active {
  animation: fadeOutDown;
  animation-duration: var(--lt-names-show-hide-anim-dur);
  animation-timing-function: ease-in-out;
}

.names-enter,
.names-leave-to {
  opacity: 0;
}
</style>
