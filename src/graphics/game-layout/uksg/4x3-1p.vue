<script setup lang="ts">
import MediaBoxBox from '../components/MediaBoxBox.vue';
import ParticipantInfo from './components/ParticipantInfo.vue';
import RunInfo from './components/RunInfo.vue';
import TimerElem from './components/TimerElem.vue';
import GameCapture from '../components/GameCapture.vue';
</script>

<template>
  <div>
    <RunInfo :class="$style.RunInfo" />
    <TimerElem
      class="BorderRight BorderBottom"
      :class="$style.Timer"
    />
    <!-- Camera Feed -->
    <div
      id="CameraCapture1"
      class="Fixed Capture BorderRight BorderTop BorderBottom"
      :class="$style.CameraFeed"
    />
    <!-- Runner/Player -->
    <ParticipantInfo
      :class="$style.Player"
      type="player"
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
    <!-- Game Feed -->
    <GameCapture
      id="GameCapture1"
      class="Fixed Capture BorderLeft"
      :class="$style.GameFeed"
      :slot-no="0"
    />
  </div>
</template>

<style lang="scss" module>
.RunInfo {
  left: 0px;
  top: 0px;
  width: 590px;
  height: 162px;
  z-index: 1;
}

.Timer {
  left: 0px;
  top: 162px;
  width: 590px;
  height: 97px;
}

.CameraFeed {
  left: 0px;
  top: 256px;
  width: 590px;
  height: 308px;
}

.Player {
  left: 0px;
  top: 561px;
  width: 590px;
  height: 73px;
}

.Host {
  left: 0px;
  top: 631px;
  width: 590px;
  height: 46px;
}

.Comm1 {
  left: 0px;
  top: 674px;
  width: 590px;
  height: 46px;
}

.Comm2 {
  left: 0px;
  top: 717px;
  width: 590px;
  height: 46px;
}

.ImageRotation {
  left: 0px;
  top: 763px;
  width: 587px;
  height: 237px;
}

.GameFeed {
  left: 587px;
  top: 0px;
  width: 1333px;
  height: 1001px;
}
</style>
