<template>
  <div
    class="Flex"
    :style="{
      padding: '0 17px',
      'padding-top': '10px',
      height: '100%',
      'font-weight': 500,
      'flex-direction': 'column',
      'align-items': 'flex-start',
    }"
  >
    <div :style="{ 'font-size': '20px' }">
      {{ when }}
    </div>
    <div :style="{ 'font-size': '26px' }">
      <span v-if="getRunTotalPlayers(run) > 0">
        {{ formPlayerNamesStr(run) }}
        play<span v-if="getRunTotalPlayers(run) === 1">s</span> {{ run.game }}
      </span>
      <span v-else>
        {{ run.game }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { replaceLast, wait } from '@esa-layouts/graphics/_misc/helpers';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RunData } from 'speedcontrol-util/types';
import { SpeedcontrolUtilBrowser } from 'speedcontrol-util';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

@Component({
  name: 'UpcomingRun',
})
export default class extends Vue {
  @Prop({ type: Number, default: 25 }) readonly seconds!: number;
  @Prop({ type: Object, required: true }) readonly run!: RunData;
  getRunTotalPlayers = SpeedcontrolUtilBrowser.getRunTotalPlayers;
  formPlayerNamesStr = SpeedcontrolUtilBrowser.formPlayerNamesStr;

  get when(): string {
    return this.run.scheduledS
      ? `in about ${dayjs.utc().to(dayjs.unix(this.run.scheduledS), true)}`
      : 'soon';
  }

  get playerNames(): string {
    return replaceLast(this.formPlayerNamesStr(this.run), ',', ' and');
  }

  async created(): Promise<void> {
    await wait(this.seconds * 1000); // Wait the specified length.
    this.$emit('end');
  }
}
</script>
