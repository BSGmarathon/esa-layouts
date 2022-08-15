<template>
  <div id="omnibar">
    <div id="information" :class="{ 'no-dash': !dashInfo }" :style="{
      width: infoWidth,
    }">
      <ticker @set-dash="updateDash"/>
    </div>
    <div id="left">
      <transition name="omnibar-dash">
        <div id="dash" v-if="dashInfo" :key="JSON.stringify(dashInfo)">
          <p :style="{
            'font-size': `${dashInfo.fontSize}px`,
            'top': `${dashInfo.top}px`,
          }">{{ dashInfo.text }}</p>
        </div>
      </transition>
      <div class="box">
        <clock class="clock"/>
<!--        <img src="./omniing/bsgstick.png"  id="logobsg">-->
      </div>
    </div>
        <div id="right">
          <div class="dash">
            <total :style="{
              // 'padding-left': '100px',
              // 'padding-top': '8px',
              'margin-right': '3px',
              'text-align': 'right',
              'font-family': 'Goodlight',
              }"
              @totalUpdate="updateInfoWidth"
            />
          </div>
          <div class="box">
            <img src="./omniing/mind_logo.png" alt="">
          </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { replicantModule } from '@esa-layouts/browser_shared/replicant_store';
import Total from './components/Total.vue';
import Ticker from './components/Ticker.vue';
import Clock from './components/Clock.vue';
import { DashProps, Omnibar } from '../../types/schemas';

@Component({
  components: {
    Total,
    Ticker,
    Clock,
  },
})
export default class extends Vue {
  dashInfo?: DashProps | null | undefined = null;
  infoWidth = '981px';

  updateInfoWidth(newTotal: number): void {
    if (newTotal < 1000) {
      this.infoWidth = '981px';
      return;
    }

    if (newTotal < 10000) {
      this.infoWidth = '916px';
      return;
    }

    if (newTotal < 100000) {
      this.infoWidth = '885px';
    }
  }

  updateDash(newDashText: DashProps | null | undefined): void {
    this.dashInfo = newDashText;
  }

  created(): void {
    const omnibar = replicantModule.reps.omnibar as Omnibar;
    this.dashInfo = omnibar?.current?.props?.dash;
  }
}
</script>

<style lang="scss">
@import "~animate.css";

html, body {
  padding: 0;
  margin: 0;
}

* {
  --bsg-color: #cf773b;
  --slide-color: #914e21;
  --bg-start: #303030;
  --bg-end: #212121;

  --dash-left-width: 194px;
}

#omnibar {
  //display: flex;
  position: relative;
  //position: fixed;
  flex-grow: 1;
  width: 1920px;
  height: 82px;

  background: linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%);

  #left {
    position: absolute;

    .box {
      position: absolute;
      left: 0;
      height: 82px;
      //width: 256px;
      width: var(--dash-left-width);
      //width: 194px;
      background: var(--bsg-color);
      border-radius: 0px 0px 34px 0px / 0px 0px 100px 0px;

      /*img {
        width: 50px;
        height: 50px;
      }*/
    }

    #logobsg {
      position: relative;
      left: 169px;
      width: 50px;
      height: 50px;
      top: -62px;
    }

    #dash {
      position: absolute;
      // TODO: local file
      background: url("./omniing/left_dash.png");
      //left: 244px;
      left: calc(var(--dash-left-width) - 14px);
      width: 321px;
      height: 82px;
      top: 0;
      animation-duration: 500ms;
      font-family: 'Goodlight';

      &.hide {
        display: none;
      }

      p {
        color: white;
        position: absolute;
        left: 34px;
        max-width: 200px;
        word-break: break-word;
        top: 22px;
        font-size: 1.9vw;
        //font-size: 37px;
        // top: calc((82px - 118px) / 2);
        text-transform: uppercase;
        vertical-align: middle;
        text-align: center;
        margin: 0;
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
    left: 492px;
    width: 981px;
    /* TODO: make this fit automatically */
    //width: 883px;
    //box-sizing: border-box;
    //border: solid green;
    animation-duration: 500ms;
    height: 82px;
    //border: 1px green solid;

    &.no-dash {
      //left: 269px;
      left: 194px;
      width: 1240px;
    }

    /* TODO: put this in the ticker transition */
    &.show {
      opacity: 1;
      animation: fadeInUp;
      animation-duration: 500ms;
    }

    &.hide {
      display: none;
    }
  }

  #right {
    position: absolute;
    right: 0;
    top: 0;

    .box {
      position: absolute;
      right: 0;
      height: 82px;
      width: 203px;
      background: var(--bsg-color);
      // border-radius: 0px 0px 0px 34px / 0px 0px 0px 100px;
      border-radius: 0px 0px 0px 34px / 0px 0px 0px 85px;

      img {
        position: relative;
        height: 82px;
        left: 79px;
      }
    }

    .dash {
      position: absolute;
      // background: url("./omniing/left_dash.png");
      background: #914e21;
      right: 222px;
      // width: 404px;
      min-width: 10px;
      height: 82px;
      top: 0;
      animation-duration: 500ms;

      &:before {
        content: '';
        position: absolute;
        background: url('./omniing/right_dash_front.png') center center;
        background-size: cover;
        height: 82px;
        width: 104px;
        left: -104px;
        top: 0px;
      }

      &:after {
        content: '';
        position: absolute;
        z-index: 0;
        background: url('./omniing/right_dash_back.png') center center;
        background-size: cover;
        height: 82px;
        width: 44px;
        right: -44px;
        top: 0px;
      }

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
  }
}

#GenericMessage {
  padding-top: 8px;
}

.omnibar-dash-leave-active {
  animation: slideOutLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

.omnibar-dash-enter-active {
  animation: slideInLeft;
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}

.omnibar-dash-enter, .omnibar-dash-leave-to {
  left: 0px;
}
</style>
