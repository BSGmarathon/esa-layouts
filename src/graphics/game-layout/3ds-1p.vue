<template>
  <div class="bsglayout _3ds_1p">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :style="{
        left: '574px',
        top: '0px',
        width: '1346px',
        height: '808px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class=""
      :style="{
        left: '0px',
        top: '594px',
        width: '550px',
        height: '404px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
        left: '0px',
        top: '0px',
        width: '553px',
        height: '319px',
      }"
    />

    <!-- Player -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '0px',
        top: '331px',
        width: '559px',
        height: '44px',
      }"
    >
      <player/>
    </div>

    <!--host, comms, timer-->
    <div class="Fixed FlexColumn"
         :style="{
          left: '0px',
          top: '380px',
          width: '559px',
          height: '203px',
        }"
    >
      <commentators-reader/>
      <commentators-reader show-reader/>
      <timer line-right/>
    </div>

    <!-- Media Box -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '564px',
        top: '822px',
        width: '641px',
        height: '176px',
      }"
    >
      <flashing-lights-warning class="Flex" style="align-self: flex-start" />
      <media-box-box
        line-right
        line-left
        :style="{
          width: '641px',
          height: '100%',
        }"
      />
    </div>

    <!-- Run Game Info -->
    <div
      class="Fixed FlexColumn"
      :style="{
        left: '1210px',
        top: '822px',
        width: '710px',
        height: '176px',
      }"
    >
      <run-info line-right text-align="left"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBoxBox from './components/MediaBoxBox.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import DonationBar from './components/DonationBar.vue';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBoxBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {
}
</script>
