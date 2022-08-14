<template>
<div :style="{ 'backgroundImage': `url(bsgbacks/widescreen_3_bg.png)`,
'background-repeat': 'no-repeat'}
">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class="BlockRed"
      :slot-no="0"
      finish-time-pos="topleft"
      :style="{
        left: '0px',
        top: '0px',
        width: '710px',
        height: '404px',
      }"
    />
    <game-capture
      id="GameCapture2"
      class=" BlockRed"
      :slot-no="1"
      finish-time-pos="topright"
      :style="{
        left: '602px',
        top: '597px',
        width: '712px',
        height: '404px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class="BlockRed"
      :slot-no="2"
      finish-time-pos="bottomright"
      :style="{
        left: '1204px',
        top: '0px',
        width: '712px',
        height: '404px',
      }"
    />

    <!-- Camera Captures -->
    <!-- Commentators Inside -->
    <div
      id="CameraCapture1"
      class="Capture Flex BlockBlue Relative"
      :style="{
        'justify-content': 'flex-start',
        'flex-direction': 'column-reverse',
        left: '740px',
        top: '0px',
        width: '438px',
        height: '323px',
      }"
    >
      <flashing-lights-warning/>
      <!--<comm-and-reader />-->
    </div>

    <!-- Players -->
    <div
      class="Fixed FlexColumn BlockGreen"
    :style="{
      'font-size': '22px',
      left: '38px',
      top: '418px',
      width: '523px',
      height: '83px',
    }"
    >
    <player  :slot-no="0"  />
        </div>

        <div
          class="Fixed FlexColumn BlockGreen"
        :style="{
          'font-size': '22px',
          left: '714px',
          top: '498px',
          width: '523px',
          height: '83px',
        }"
        >
    <player :slot-no="1"/>
    </div>

    <div
      class="Fixed FlexColumn BlockGreen"
    :style="{
      'font-size': '22px',
      left: '1360px',
      top: '418px',
      width: '523px',
      height: '83px',
    }"
    >
    <player
      :slot-no="2"
    />
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BlockYellow"
      :style="{
        left: '24px',
        top: '603px',
        width: '550px',
        height: '274px',
      }"
    >
      <run-info />
      <div class="sub_div">
      <commentators-reader />
<commentators-reader show-reader />
    </div>
    </div>

    <!-- TIMER -->

    <div
      class="Fixed FlexColumn BlockBlack"
      :style="{
        flex: '1',
        width: '100%',
        left: '156px',
        top: '904px',
        width: '534px',
        height: '100px',
      }"
    >
            <timer />
          </div>

    <!-- Media Box -->
    <media-box
      class="BlockPurple"
      :font-size="20"
      :style="{
        left: '1353px',
        top: '589px',
        width: '548px',
        height: '409px',
      }"
    />

    <!-- Donation Bar -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import MediaBox from '@shared/graphics/mediabox';
import GameCapture from './components/GameCapture.vue';
import Player from './components/Player.vue';
import CommentatorsReader from './components/CommentatorsReader.vue';
import RunInfo from './components/RunInfo.vue';
import Timer from './components/Timer.vue';
import DonationBar from './components/DonationBar.vue';
import FlashingLightsWarning from './components/FlashingLightsWarning.vue';

@Component({
  components: {
    GameCapture,
    Player,
    CommentatorsReader,
    RunInfo,
    Timer,
    MediaBox,
    DonationBar,
    FlashingLightsWarning,
  },
})
export default class extends Vue {}
</script>
