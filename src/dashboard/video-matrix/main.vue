<template>
  <v-app>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left text-muted input-dash-output">
              <span>output</span>
              <hr>
              <span>input</span>
            </th>
            <th v-for="capture in gameCaptures"
                :key="capture"
                class="text-left">
              {{ capture }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(source, si) in gameSources"
              :key="source">
            <td class="text--lighten-5">{{ source }}</td>
            <td v-for="ci in gameCaptures.length" :key="ci">
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
  obsConfig = (nodecg.bundleConfig as Configschema).obs;
  gameCaptures: string[] = [];
  selectedCaptures: number[] = [];
  locked = false;

  async mounted(): Promise<void> {
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
    const captures = this.obsConfig.names.groups.gameCaptures;

    if (Array.isArray(captures)) {
      return captures;
    }

    return [captures];
  }

  get gameSources(): string[] {
    const sources = this.obsConfig.names.sources.gameSources;

    if (Array.isArray(sources)) {
      return sources;
    }

    return [sources];
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
