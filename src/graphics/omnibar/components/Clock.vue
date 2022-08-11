<template>
  <div
    class="Clock"
    :style="{
      width: '90px',
      'font-size': '35px',
    }"
  >
    {{ time }}
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

@Component
export default class extends Vue {
  time = '00:00';

  setTime(): void {
    this.time = dayjs().tz('Europe/Amsterdam').format('HH:mm');
  }

  created(): void {
    this.setTime();
    setInterval(() => { this.setTime(); }, 1000);
  }
}
</script>

<!-- TODO: move this to correct style sheet -->
<style scoped>
.Clock {
  flex-shrink: 3;
  font-size: 35px;
  /*width: 90px;*/
  padding-left: 30px;
  padding-top: 19px;
  font-family: 'Goodlight'
}
</style>
