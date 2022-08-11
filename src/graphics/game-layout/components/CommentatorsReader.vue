<template>
  <div
    class="Flex"
    :style="{
      width: '100%',
      'font-size': '0.2em',
      height: show ? '20px' : 0,
      opacity: show ? 1 : 0,
      'margin-top': show ? '12px' : 0,
      'font-weight': 200,
      'margin-left': '8px',
      background: 'rgba(0, 0, 0, 0.4)', // HARDCODED, BAD!
      color: 'white', // HARDCODED, BAD!
      'margin-bottom': '12px',
              'font-family': 'Goodlight-light',
    }"
  >
    <div
      class="Flex"
      :style="{
        'min-width': '140px',
        height: '100%',
        background: '#914e21', // HARDCODED, BAD!
        'justify-content': 'center',
        // 'padding-left': '10px',
        'font-size': '20px',
        'font-weight': 200,
        'font-size': '18px',
        'font-family': 'Goodlight-light',
      }"
    >
      <template v-if="showReader">Host</template>
      <template v-else>
        <template v-if="comms.length > 1">Commentators</template>
        <template v-else>Commentator</template>
      </template>
    </div>
    <div
      :style="{
        'flex-grow': 1,
        'justify-content': 'flex-end',
        'margin': '0 10px',

      }"
    >
      <div :style="{ width: '98%', 'text-align': 'center' }">
        <span
          ref="Fit"
          :style="{
            'white-space': 'nowrap',
            display: 'flex !important',
            height: '100%',
          }"
        >
          <template v-if="showReader">
            <template v-if="reader">{{ reader.name }}</template><span
              v-if="reader && reader.pronouns" class="Pronouns">{{ reader.pronouns }}</span>
          </template>

          <template v-else>
            <span v-for="({ name, pronouns }, i) in comms" :key="i">
              {{ name }}<span v-if="pronouns" class="Pronouns">
                {{ pronouns }}</span><template v-if="i < comms.length - 1">,</template>
            </span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Commentators, DonationReader } from '@esa-layouts/types/schemas';
import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';
import fitty, { FittyInstance } from 'fitty';

@Component
export default class extends Vue {
  @Prop(Boolean) readonly showReader!: boolean;
  @State readonly commentators!: Commentators;
  @State readonly donationReader!: DonationReader;
  @Ref('Fit') toFit!: HTMLElement;
  fittyInstance!: FittyInstance;

  get show(): boolean {
    return !!(this.showReader ? this.reader : this.comms.length);
  }

  get comms(): { name: string, pronouns?: string }[] {
    return this.commentators.map((c) => ({
      name: c.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (c.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    }));
  }

  get reader(): { name: string, pronouns?: string } | undefined {
    if (!this.donationReader) {
      return undefined;
    }
    return {
      name: this.donationReader.replace(/\((.*?)\)/g, '').trim(),
      pronouns: (this.donationReader.match(/\((.*?)\)/g) || [])[0]?.replace(/[()]/g, ''),
    };
  }

  mounted(): void {
    this.fittyInstance = fitty(this.toFit, {
      minSize: 1,
      maxSize: 18,
      multiLine: false,
    });
  }

  destroyed(): void {
    this.fittyInstance.unsubscribe();
  }
}
</script>

<style scoped>
  .Pronouns {
    position: relative;
    display: inline-block;
    font-weight: 200;
    font-size: 0.6em;
    top: 0.1em;
    /* background: #2d1d3c; /* ESA */
    background: #914e21; /* UKSG */
    color: #ffffff;
    text-transform: uppercase;
    font-family: Goodlight-light;
    padding: 0 3px;
    margin-left: 3px;
  }
</style>
