<template>
  <div
    class="Flex"
    :style="{
      'font-size': '33px',
      'white-space': 'nowrap',
      'font-weight': 500,
      'text-align': 'center',
      // 'line-height': '100%',
    }"
  >
    <span v-if="musicData.playing" :style="{ 'white-space': 'pre' }">🎵 {{ trackInformation }}</span>
    <span v-else :style="{ 'white-space': 'pre' }">⏸ {{ trackInformation }}</span>
  </div>
</template>

<script lang="ts">
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { wait } from '@esa-layouts/graphics/_misc/helpers';
import { MusicData } from '@esa-layouts/types/schemas';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'MusicTrack',
})
export default class extends Vue {
  @replicantNS.State((s) => s.reps.musicData) readonly musicData!: MusicData;
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;

  get trackInformation(): string | undefined {
    const info = [
      this.musicData?.track?.title,
      this.musicData?.track?.artist,
    ].filter(Boolean);
    return info.length ? info.join(' - ') : undefined;
  }

  async created(): Promise<void> {
    // Skip display if no track is playing
    if (!this.trackInformation || !this.musicData.playing) {
      this.$emit('end');
      return;
    }

    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
