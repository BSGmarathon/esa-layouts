<template>
  <v-app v-if="online">
    <p>Disabled for online events</p>
  </v-app>
  <v-app v-else>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left text-muted input-dash-output">
              <span>input</span>
              <hr>
              <span>output</span>
            </th>
            <th v-for="capture in gameSources"
                :key="capture"
                class="text-left">
              {{ capture }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source, si) in gameCaptures" :key="source">
            <td class="text--lighten-5">{{ source }}</td>
            <td v-for="ci in gameSources.length" :key="ci">
              <v-radio-group v-model="selectedCaptures[si]" row :name="`selctor-${source}`">
                <v-radio :value="ci - 1"/>
              </v-radio-group>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { Configschema } from '../../types/schemas';

@Component
export default class extends Vue {
  cfg = nodecg.bundleConfig as Configschema;
  online = this.cfg.event.online;
  obsConfig = this.cfg.obs;
  gameCaptures: string[] = [];
  selectedCaptures: number[] = [];
  locked = false;

  async mounted(): Promise<void> {
    if (this.online) {
      return;
    }

    this.locked = true;

    // Only compute on startup for performance reasons :)
    this.gameCaptures = this.computeGameCaptures();

    nodecg.listenFor('gameSourceVisibilityUpdated', (data: number[]) => {
      this.selectedCaptures = data;
    });

    // load initial settings
    this.selectedCaptures = await nodecg.sendMessage('getGameSourceVisibility');

    this.locked = false;
  }

  computeGameCaptures(): string[] {
    const gameCaptures = Array.isArray(this.obsConfig.names.groups.gameCaptures)
      ? this.obsConfig.names.groups.gameCaptures
      : [this.obsConfig.names.groups.gameCaptures];
    const cameraCaptures = Array.isArray(this.obsConfig.names.groups.cameraCaptures)
      ? this.obsConfig.names.groups.cameraCaptures
      : [this.obsConfig.names.groups.cameraCaptures];

    return gameCaptures.concat(cameraCaptures);
  }

  get gameSources(): string[] {
    const gameSources = Array.isArray(this.obsConfig.names.sources.gameSources)
      ? this.obsConfig.names.sources.gameSources
      : [this.obsConfig.names.sources.gameSources];
    const cameraSources = Array.isArray(this.obsConfig.names.sources.cameraSources)
      ? this.obsConfig.names.sources.cameraSources
      : [this.obsConfig.names.sources.cameraSources];

    return gameSources.concat(cameraSources);
  }

  get selectedCapturesComputed(): number[] {
    return JSON.parse(JSON.stringify(this.selectedCaptures));
  }

  @Watch('selectedCapturesComputed')
  async onSelectedCapturesChanged(newVal: number[], oldVal?: number[]): Promise<void> {
    if (this.locked || !oldVal) {
      return;
    }

    // find the index that changed, there's no way more than one index changes at once
    let captureIndex = -1;

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < newVal.length; i++) {
      const newNum = newVal[i];
      const oldNum = oldVal[i];

      if (newNum !== oldNum) {
        captureIndex = i;
        break;
      }
    }

    // Sanity check
    if (captureIndex === -1) {
      return;
    }

    this.locked = true;

    const captureName = this.gameCaptures[captureIndex];
    const sourceName = this.gameSources[newVal[captureIndex]];

    // We're using a different event here to prevent loops.
    await nodecg.sendMessage('setSelectedCaptures', {
      sceneName: captureName,
      sourceName,
    });

    this.locked = false;
  }
}
</script>
<style lang="scss" scoped>
.theme--dark.v-data-table>.v-data-table__wrapper>table>tbody>tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #1e1e1e !important;
}

.input-dash-output {
  position: relative;

  hr {
    transform: rotate(21deg);
  }

  span {
    position: absolute;

    &:first-of-type {
      top: 5px;
      right: 25px;
    }

    &:last-of-type {
      left: 17px;
    }
  }
}
</style>
