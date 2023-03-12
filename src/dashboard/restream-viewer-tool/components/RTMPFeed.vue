<template>
  <div>
    <v-checkbox
      :disabled="!value.editAllowed"
      v-model="value.enabled"
      :label="`Feed ${value.feedIndex}`"
    />
    <v-row>
      <v-col cols="5">
        <v-select
          :disabled="!canEdit"
          v-model="value.server"
          label="Instance"
          item-text="name"
          item-value="prefix"
          :items="instances"
          persistent-hint
          single-line
        />
      </v-col>
      <v-col>
        <v-text-field label="Stream key" v-model="value.streamKey" filled :disabled="!canEdit" />
      </v-col>
    </v-row>
    <v-text-field
      label="RTMP url"
      :value="`rtmp://${value.server}.bsgmarathon.com/live`"
      readonly
      filled
      :disabled="!canEdit" />
  </div>
</template>

<script lang="ts">
import { RtmpFeed } from '@esa-layouts/types/schemas';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PropType } from 'vue';

@Component
export default class extends Vue {
  @Prop({ type: Object as PropType<RtmpFeed>, required: true }) value!: RtmpFeed;
  instances = [
    {
      prefix: 'eu',
      name: 'Europe',
    },
    {
      prefix: 'na',
      name: 'North-America',
    },
  ];

  get canEdit(): boolean {
    return this.value.editAllowed && this.value.enabled;
  }
}
</script>
