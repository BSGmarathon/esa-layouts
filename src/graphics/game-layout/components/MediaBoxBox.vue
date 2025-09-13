<script setup lang="ts">
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';

withDefaults(defineProps<{
  vertical: boolean;
  lineLeft: boolean;
  lineRight: boolean;
}>(), {
  vertical: false,
  lineLeft: false,
  lineRight: false,
});
</script>

<template>
  <div class="FlexColumn media-box-box">
    <div class="FlexColumn right-line" :style="{
        'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
        'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
    }">
      <MediaBox
        class="MBNoPadding"
        :font-size="20"
        :vertical="vertical"
        :style="{
          left: '0px',
          top: '0px',
          width: '100%',
          height: '100%',
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.media-box-box {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  justify-content: center;
  //background: orange;
}

.right-line {
  align-self: center;
  box-sizing: border-box;
  position: relative;
  width: calc(100% - 14px);
  height: calc(100% - 12px);
}

.MBNoPadding {
  box-sizing: border-box;
  position: relative !important;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}
</style>
