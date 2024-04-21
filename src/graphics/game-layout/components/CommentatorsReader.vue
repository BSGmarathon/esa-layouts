<template>
  <div
    v-show="show"
    class="Flex"
    :style="{
      width: '100%',
      'align-items': 'center',
      height: show ? '44px' : 0,
      opacity: show ? 1 : 0,
      'font-weight': 600,
      color: 'var(--text-color)',
      'font-family': 'Bahnschrift',
      'font-size': '1.5em',
      [borderLocation]: '5px solid var(--bsg-color)',
    }"
  >
    <div
      class="Flex"
      :style="{
        width: '89px',
        height: '100%',
        background: 'var(--bsg-color)',
        'justify-content': 'center',
        'align-items': 'center',
        'font-weight': 300,
        'font-size': '18pt',
        'text-transform': 'uppercase',
        'font-family': 'pixelmix',
      }"
    >
      <template v-if="showReader">Host</template>
      <template v-else>Comm</template>
    </div>
    <div
      class="Flex"
      :style="{
        // width: '486px',
        width: '100%',
        height: '43px',
        'justify-content': 'center',
        'align-items': 'center',
      }"
    >
      <div
        class="Flex"
        :style="{
        'text-align': 'center',
        'align-self': 'center',
      }">
        <span
          ref="Fit"
          :style="{
            'white-space': 'nowrap',
            display: 'flex !important',
          }"
        >
          <template v-if="showReader">
            <template v-if="reader">{{ reader.name }}</template><span
              v-if="reader && reader.pronouns" class="Pronouns">{{ reader.pronouns }}</span>
          </template>

          <template v-else>
            <!-- weird html? I know -->
            <!-- new lines are taken as extra spacing here -->
            <span v-for="({ name, pronouns }, i) in comms" :key="i">
              {{ name }}
              <span
                v-if="pronouns"
                class="Pronouns">{{ pronouns }}</span><template
              v-if="i < comms.length - 1">,</template>
            </span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CommentatorsNew, DonationReaderNew } from '@esa-layouts/types/schemas';
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @Prop(Boolean) readonly showReader!: boolean;
  @Prop(Boolean) readonly lineTop!: boolean;
  @State readonly commentatorsNew!: CommentatorsNew;
  @State readonly donationReaderNew!: DonationReaderNew;
  @Ref('Fit') toFit!: HTMLElement;
  fittyInstance!: FittyInstance;

  get show(): boolean {
    return !!(this.showReader ? this.reader : this.comms.length);
  }

  get comms(): CommentatorsNew {
    return this.commentatorsNew;
  }

  get reader(): DonationReaderNew | undefined {
    return this.donationReaderNew;
  }

  get borderLocation(): string {
    return this.lineTop ? 'border-top' : 'border-bottom';
  }

  mounted(): void {
    this.fittyInstance = fitty(this.toFit, {
      minSize: 1,
      maxSize: 30,
      multiLine: false,
    });
  }

  destroyed(): void {
    this.fittyInstance.unsubscribe();
  }
}
</script>

<style scoped lang="scss">
  .Pronouns {
    position: relative;
    height: 19px;
    margin-left: 5px;
    margin-right: 5px;

    font-size: 12pt;

    padding: 4px;

    //font-size: 0.8em;
    background: var(--slide-color);
    color: var(--text-color);
    text-transform: uppercase;
    font-family: pixelmix;
  }
</style>
