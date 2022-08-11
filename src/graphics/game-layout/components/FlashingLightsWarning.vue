<template>
  <div class="flashingLightsWarning"
       v-if="hasFlashingLights"
  >
    This game contains flashing lights
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'; // eslint-disable-line object-curly-newline, max-len
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;

  get hasFlashingLights(): boolean {
    return this.runData?.customData?.flashingLights === 'true';
  }
}
</script>

<style scoped>
.flashingLightsWarning {
  background-color: red;
  box-sizing: border-box;
  padding: 7px;
  /*position: relative;*/
  color: white;
  line-height: 50px;

  position: absolute;
  top: 9px;
  left: 9px;
  width: 100%;

  font-size: 21pt;
  white-space: normal;
  font-family: Goodlight-light;
}
</style>
