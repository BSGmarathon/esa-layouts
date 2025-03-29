<script setup lang="ts">
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import { ref } from 'vue';

dayjs.extend(timezone);

const time = ref('00:00');
const date = ref('00/00/0000');

function setTime(): void {
  const timer = dayjs().tz('Europe/Amsterdam');

  time.value = timer.format('HH:mm').trim();
  date.value = timer.format('DD/MM/YYYY').trim();
}

setTime();
const now = new Date().getSeconds();
const secondsUntilNextMinute = 60 - now;

// Sync the time with the PC clock
setTimeout(() => {
  setTime();

  setInterval(() => setTime(), 1000);
}, secondsUntilNextMinute * 1000);
</script>

<template>
  <div
    class="Clock"
    :style="{
      width: '100%',
      height: '100%',
    }"
  >
    <span>{{ time }}</span>
    <span>{{ date }}</span>
  </div>
</template>

<style scoped lang="scss">
.Clock {
  font-variant-numeric: tabular-nums;
  position: relative;
  left: -15px;
  text-align: center;
  padding-top: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Bahnschrift';

  span:first-child {
    font-size: 40px;
  }

  span:nth-child(2) {
    font-size: 20px;
  }
}
</style>
