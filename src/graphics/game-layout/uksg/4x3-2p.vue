<script setup lang="ts">
import MediaBoxBox from '../components/MediaBoxBox.vue';
import ParticipantInfo from './components/ParticipantInfo.vue';
import RunInfo from './components/RunInfo.vue';
import TimerElem from './components/TimerElem.vue';
import GameCapture from '../components/GameCapture.vue';
</script>

<template>
  <div>
    <RunInfo
      :class="$style.RunInfo"
      name-font-size="36px"
      subtitle-font-size="22px"
      flipped
      horizontal
    />
    <TimerElem
      class="BorderBottom"
      :class="$style.Timer"
    />
    <!-- Game Feeds -->
    <GameCapture
      id="GameCapture1"
      class="Fixed Capture BorderAll"
      :class="$style.GameFeed1"
      :slot-no="0"
    />
    <GameCapture
      id="GameCapture2"
      :slot-no="1"
      finish-time-pos="bottomright"
      class="Fixed Capture BorderAll"
      :class="$style.GameFeed2"
    />
    <!-- Camera Feed -->
    <div
      id="CameraCapture1"
      class="Fixed Capture BorderTop BorderLeft BorderRight"
      :class="$style.CameraFeed"
    />
    <!-- Runners/Players -->
    <ParticipantInfo
      :class="$style.Player1"
      name-font-size="30px"
      type="player"
      :index="0"
    />
    <ParticipantInfo
      :class="$style.Player2"
      name-font-size="30px"
      type="player"
      :index="1"
    />
    <!-- Host -->
    <ParticipantInfo
      :class="$style.Host"
      type="host"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm1 -->
    <ParticipantInfo
      :class="$style.Comm1"
      type="comm1"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm2 -->
    <ParticipantInfo
      :class="$style.Comm2"
      type="comm2"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <div class="Fixed" :class="$style.ImageRotation">
      <MediaBoxBox
        style="position: unset;"
        :class="$style.ImageRotation"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.RunInfo {
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 1270px;
  height: 97px;
}

.Timer {
  left: 1270px;
  top: 0px;
  width: 650px;
  height: 97px;
}

.GameFeed1 {
  left: 72px;
  top: 94px;
  width: 891px;
  height: 666px;
}

.GameFeed2 {
  left: 960px;
  top: 94px;
  width: 889px;
  height: 666px;
}

.CameraFeed {
  left: 659px;
  top: 757px;
  width: 602px;
  height: 243px;
}

.Player1 {
  left: 0px;
  top: 757px;
  width: 662px;
  height: 81px;
}

.Player2 {
  left: 1258px;
  top: 757px;
  width: 662px;
  height: 81px;
}

.Host {
  left: 0px;
  top: 835px;
  width: 480px;
  height: 48px;
}

.Comm1 {
  left: 0px;
  top: 880px;
  width: 480px;
  height: 49px;
}

.Comm2 {
  left: 0px;
  top: 924px;
  width: 480px;
  height: 49px;
}

.ImageRotation {
  left: 1261px;
  top: 838px;
  width: 659px;
  height: 162px;
}
</style>
