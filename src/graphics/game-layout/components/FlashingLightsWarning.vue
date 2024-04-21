<template>
  <div class="flashingLightsWarning"
       v-if="hasFlashingLights"
  >
    This game contains flashing lights
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { RunDataActiveRun } from 'speedcontrol-util/types';

@Component
export default class extends Vue {
  @State('runDataActiveRun') runData!: RunDataActiveRun;

  get hasFlashingLights(): boolean {
    return this.runData?.customData?.flashingLights === 'true';
  }

  @Watch('hasFlashingLights', { immediate: true })
  onFlashingLightsChanged(newValue: boolean) {
    this.$emit('flashing-lights-updated', newValue);
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

  width: 100%;

  font-size: 21pt;
  white-space: normal;
  font-family: Goodlight-light;
}
</style>
