<script setup lang="ts">
import { omnibar } from '@esa-layouts/browser_shared/replicant_store';
import { onMounted, ref } from 'vue';
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { useHead } from '@vueuse/head';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import { DashProps } from '../../types/schemas';

useHead({ title: 'Omnibar' });

const dashInfo = ref<DashProps | null | undefined>(null);
const infoWidth = ref('981px');

function updateInfoWidth(newTotal: number): void {
  if (newTotal < 1000) {
    // this.infoWidth = '1045px';
    infoWidth.value = '1070px';
    return;
  }

  if (newTotal < 10000) {
    // this.infoWidth = '1015px';
    infoWidth.value = '1040px';
    return;
  }

  if (newTotal < 100000) {
    infoWidth.value = '1020px';
  }
}

function updateDash(newDashText: DashProps | null | undefined): void {
  dashInfo.value = newDashText;
}

onMounted(async () => {
  while (!omnibar.data) {
    await wait(100);
  }

  dashInfo.value = omnibar.data.current?.props?.dash;
});
</script>

<template>
  <div id="omnibar">
    <div id="information" :class="{ 'no-dash': !dashInfo }" :style="{
      width: dashInfo ? infoWidth : undefined,
    }">
      <Ticker @set-dash="updateDash"/>
    </div>
    <div id="left">
      <transition name="omnibar-dash">
        <div class="dashContainer" v-if="dashInfo" :key="JSON.stringify(dashInfo)">
          <div class="arrow_base dash_seg_2" />
          <div class="arrow_base dash_seg_1" />
          <div id="dash" >
            <p :style="{
            'left': dashInfo.left ? `${dashInfo.left}px` : '40px',
            'font-size': `${dashInfo.fontSize}px`,
            'top': `${dashInfo.top}px`,
          }">{{ dashInfo.text }}</p>
          </div>
          <div class="arrow_base before_dash" />
        </div>
      </transition>
      <div class="box">
        <Clock class="clock"/>
      </div>
    </div>
        <div id="right">
          <div class="dashContainer">
            <div class="dash">
              <Total :style="{
                'margin-right': '3px',
                'text-align': 'right',
                'font-family': 'Bahnschrift',
                }"
                @totalUpdate="updateInfoWidth"
              />
            </div>
          </div>
          <div class="arrow_base right after_right_box" />
          <div class="box">
            <img src="./omniing/mind_logo_tag.png" alt=""/>
          </div>
      </div>
    </div>
</template>

<style lang="scss">
@use "dash-helpers";
@import "animate.css";

* {
  --dash-left-width: 160px;
  --dark-arrow-default: #232323;
}

html, body {
  padding: 0;
  margin: 0;
}

#omnibar {
  //display: flex;
  position: relative;
  //position: fixed;
  flex-grow: 1;
  width: 1920px;
  height: 82px;

  background-image: url('./omniing/background.png');
  //background: yellow;

  #left {
    position: absolute;

    .box {
      position: absolute;
      left: 0;
      height: 82px;
      width: var(--dash-left-width);
      background: var(--slide-color);
      clip-path: polygon(80% 0, 100% 50%, 80% 100%, 0% 100%, 0 51%, 0% 0%);
    }

    .after_left_box {
      position: absolute;
      --color: var(--dark-arrow-default);
      left: calc(var(--dash-left-width) - 60px);
    }

    #logobsg {
      position: relative;
      left: 169px;
      width: 50px;
      height: 50px;
      top: -62px;
    }

    .dashContainer {
      width: 350px;
      position: absolute;
      left: calc(var(--dash-left-width) - 14px);
      animation-duration: 500ms;
      height: 82px;
      top: 0;

      &.hide {
        display: none;
      }

      .before_dash {
        --color: var(--dark-arrow-default);
        left: -45px;
        top: -246px;
      }

      #dash {
        position: relative;
        background: var(--bsg-color);
        clip-path: polygon(90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%, 0% 0%);
        //left: calc(var(--dash-left-width) - 14px);
        top: -164px;
        width: 300px;
        height: 82px;
        font-family: 'Bahnschrift';

        p {
          color: white;
          position: absolute;
          left: 34px;
          max-width: 200px;
          word-break: break-word;
          top: 22px;
          font-size: 34px;
          text-transform: uppercase;
          vertical-align: middle;
          text-align: center;
          margin: 0;
        }
      }

      .dash_seg_1 {
        --color: var(--dark-arrow-default);
        left: 240px;
        top: -82px;
      }

      .dash_seg_2 {
        --color: var(--bsg-color);
        left: 260px;
      }
    }
  }

  #information {
    transform: translateY(-50%);
    top: 50%;

    position: absolute;
    color: white;
    font-size: 39px;
    //top: calc((82px - 50px) / 2);
    left: 489px;
    width: 981px;
    /* TODO: make this fit automatically */
    //width: 883px;
    //box-sizing: border-box;
    //border: 1px green solid;
    animation-duration: 500ms;
    height: 82px;

    &.no-dash {
      //left: 269px;
      left: 190px;
      width: 1285px;

      /* HACK: normal text is different */
      transform: unset;
      top: 5px;
    }
  }

  #right {
    position: absolute;
    right: 0;
    top: 0;

    .box {
      position: absolute;
      right: 0;
      top: 0;
      height: 82px;
      width: 177px;
      background: var(--slide-color);
      clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 50%);

      img {
        position: relative;
        height: 82px;
        left: 20px;
      }
    }

    .dash {
      position: absolute;
      right: 160px;
      //min-width: 50px;
      height: 82px;
      top: 0;
      animation-duration: 500ms;

      &.hide {
        display: none;
      }

      p {
        color: white;
        position: relative;
        top: calc((82px - 50px) / 2);
        // left: 114px;
        font-size: 39px;
      }
    }

    .after_right_box {
      position: absolute;
      --color: var(--dark-arrow-default);
      right: 115px;
    }
  }
}

#GenericMessage {
  padding-top: 8px;
}

@mixin calcAnimation($startDelay) {
  animation: slideOutLeft;
  animation-duration: calc(500ms - #{$startDelay});
  animation-timing-function: ease-in-out;
  //animation-timing-function: cubic-bezier(0.950, 0.005, 0.580, 1.000);

  animation-delay: #{$startDelay} !important;
}

.omnibar-dash-leave-active {
  @include calcAnimation(0ms);

  //.dash_seg_2 {
  //  @include calcAnimation(0ms);
  //}
  //
  //.dash_seg_1 {
  //  @include calcAnimation(100ms);
  //}
  //
  //#dash {
  //  @include calcAnimation(200ms);
  //}
  //
  //.before_dash {
  //  @include calcAnimation(400ms);
  //}
}

.omnibar-dash-enter-active {
  animation: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;

  .before_dash {
    animation-delay: 100ms;
  }

  #dash {
    animation-delay: 150ms;
  }

  .dash_seg_1 {
    animation-delay: 200ms;
  }

  .dash_seg_2 {
    animation-delay: 400ms;
  }
}

.omnibar-dash-enter, .omnibar-dash-leave-to {
  left: -100px;
  .dash_seg_1, .dash_seg_2, #dash, .before_dash {
    left: -20px;
  }
}
</style>
