<template>
<div :style="{ 'backgroundImage': `url(bsgbacks/3DS_Stack.png)`,
'background-repeat': 'no-repeat'}
">
    <!-- Game Captures -->
    <game-capture
      id="GameCapture1"
      class=""
      :style="{
      left: '844px',
      top: '0px',
      width: '811px',
      height: '487px',
      }"
    />
    <game-capture
      id="GameCapture3"
      class=" "
      :style="{
      left: '928px',
      top: '513px',
      width: '646px',
      height: '485px',
      }"
    />

    <!-- Camera Captures -->
    <div
      id="CameraCapture1"
      class="Capture Relative"
      :style="{
      left: '8px',
      top: '273px',
      width: '546px',
      height: '355px',
      }"
    >
      <flashing-lights-warning
        :style="{
          top: '33px',
        }"
      />
    </div>

    <!-- Run Game Info/Timer -->
    <div
      class="Fixed FlexColumn BlockYellow"
      :style="{
      left: '0x',
      top: '0px',
      width: '517px',
      height: '289px',
      }"
    >
      <run-info />
      <div class="sub_div">
      <commentators-reader />
<commentators-reader show-reader />
    </div>
      </div>

          <!--TIMER-->
          <div
            class="Fixed FlexColumn BlockBlack"
            :style="{
              flex: '1',
              width: '100%',
              left: '16px',
              top: '734px',
              width: '535px',
              height: '103px',
            }"
          >
          <div
          :style="{
          left: '122px',
          'position': 'absolute',
          }">
            <timer />
      </div>
    </div>

    <!-- Player/Commetator -->
    <div
      class="Fixed"
      :style="{
      left: '0px',
      top: '636px',
      width: '553px',
      height: '83px',
      }"
    >
      <player />
      <!--<commentators-reader />
      <commentators-reader show-reader />-->
    </div>

    <!-- Media Box -->
    <media-box
      :font-size="25"
      class="Fixed FlexColumn BlockPurple"
      :style="{
      left: '19px',
      top: '849px',
      width: '537px',
      height: '149px',
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
