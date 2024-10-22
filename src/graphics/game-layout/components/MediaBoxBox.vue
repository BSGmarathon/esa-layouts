<template>
  <div class="FlexColumn media-box-box">
    <div class="FlexColumn right-line" :style="{
        'border-right': lineRight ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
        'border-left': lineLeft ? '5px solid var(--slide-color)' : '5px solid rgba(0,0,0,0)',
    }">
      <media-box
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

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MediaBox from '@esa-layouts/graphics/_misc/components/mediabox';

@Component({
  components: {
    MediaBox,
  },
})
export default class extends Vue {
  @Prop({ type: Boolean, default: false }) vertical!: string;
  @Prop({ type: Boolean, default: false }) lineLeft!: string;
  @Prop({ type: Boolean, default: false }) lineRight!: string;
}
</script>

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
  position: relative !important;
}
</style>
