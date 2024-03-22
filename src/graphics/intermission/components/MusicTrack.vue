<template>
  <div
    v-if="true"
    class="Flex MusicTrack"
    :style="{ height: '100%' }"
  >
    <div
      v-if="!hideIcon"
      class="Flex MCat"
      :style="{
        'box-sizing': 'border-box',
        height: '100%',
        padding: '5px'
      }"
    >
      <img
        src="./Music.png"
        :style="{ height: '85%', padding: '0 5px' }"
      >
    </div>
    <div
      v-if="trackInformation"
      :style="{ padding: '0 15px' }"
    >
      {{ trackInformation }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { MusicData } from '@esa-layouts/types/schemas';

@Component
export default class extends Vue {
  @State musicData!: MusicData;
  @Prop({ type: Boolean, required: false }) hideIcon!: boolean;

  get trackInformation(): string | undefined {
    const info = [
      this.musicData.track?.title,
      this.musicData.track?.artist,
      'cheese',
    ].filter(Boolean);
    return info.length ? info.join(' - ') : undefined;
  }
}
</script>
