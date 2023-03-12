<template>
  <v-app>
    <v-card
      :style="{ 'margin-bottom': '10px' }"
      tile
    >
      <v-list dense>
        <v-list-item-group>
          <v-list-item
            v-for="(name, i) in lowerThird.names"
            :key="i"
            inactive
            selectable
          >
            <v-list-item-action>
              <v-icon @click="removeName(name)">mdi-delete</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              {{ name }}
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
    <div class="d-flex">
      <v-text-field
        v-model="nameEntry"
        label="Enter Name Here"
        hide-details
        filled
        :spellcheck="false"
        :disabled="inputsDisabled"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="inputsDisabled"
        @click="add"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <div class="d-flex" style="margin-top: 10px;">
      <v-btn
        height="56px"
        :style="{ 'margin-left': '5px' }"
        @click="showLowerThird"
        :disabled="toggleButtonsDisabled || lowerThird.visible">
        Show
      </v-btn>
      <v-btn
        height="56px"
        :style="{ 'margin-left': '5px' }"
        @click="hideLowerThird"
        :disabled="autoHide || toggleButtonsDisabled || !lowerThird.visible">
        Hide
      </v-btn>
    </div>
    <div class="d-flex" style="margin-top: 10px;">
      <v-checkbox
        v-model="autoHide"
        :disabled="inputsDisabled"
        label="Auto hide after"
      />

      <v-text-field
        v-model="autoHideSeconds"
        label="seconds"
        :style="{
          'width': '10px',
        }"
        hide-details
        filled
        :spellcheck="false"
        :disabled="inputsDisabled"
      />
    </div>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantNS } from '@esa-layouts/browser_shared/replicant_store';
import { LowerThird } from '@esa-layouts/types/schemas';
import { storeModule } from './store';

@Component
export default class extends Vue {
  nameEntry = '';
  updatingName = false;
  autoHide = true;
  autoHideSeconds = '10';
  @replicantNS.State((s) => s.reps.lowerThird) readonly lowerThird!: LowerThird;
  removeName = storeModule.removeName;

  showLowerThird(): void {
    let finalAutoHide = this.autoHide;
    const afterSecs = parseInt(this.autoHideSeconds, 10);

    if (afterSecs < 1) {
      finalAutoHide = false;
    }

    nodecg.sendMessage('lower-third:show', {
      autoHide: finalAutoHide, showForSecs: afterSecs,
    });
  }

  hideLowerThird(): void {
    nodecg.sendMessage('lower-third:hide');
  }

  get toggleButtonsDisabled(): boolean {
    return this.lowerThird.transitioning || this.updatingName;
  }

  get inputsDisabled(): boolean {
    return this.toggleButtonsDisabled || this.lowerThird.visible;
  }

  async add(): Promise<void> {
    this.updatingName = true;
    try {
      await nodecg.sendMessage('lower-third:add-name', this.nameEntry);
    } catch (err) {
      // catch
    }
    this.updatingName = false;
    this.nameEntry = '';
  }
}
</script>
