<script setup lang="ts">
import clone from 'clone';
import Draggable from 'vuedraggable';
import { onMounted, ref } from 'vue';
import { waitForReplicant } from '@esa-layouts/browser_shared/helpers';
import {
  assetsMediaBoxImages as images,
  mediaBox as settings,
  prizes,
} from '@esa-layouts/browser_shared/replicant_store';
import { useMediaBoxControlStore } from '@esa-layouts/dashboard/media-box-control/store';
import { MediaBox } from '../../../types';
import ApplicableIcon from './ApplicableIcon.vue';
import MediaCard from './MediaCard.vue';
import { getMediaDetails, isPrizeApplicable } from './shared';

const store = useMediaBoxControlStore();
const dialog = ref(false);
const editingElem = ref('');
const editedText = ref('');

onMounted(async () => {
  await waitForReplicant(prizes, settings);

  store.newRotation = clone(settings.data!.rotation);
});

function isApplicable(media: MediaBox.RotationElem): boolean | undefined {
  // TODO: Check if on intermission on the dashboard size.
  // We should probably just be loading in the server applicable rotation here.
  if (!media.showOnIntermission) {
    return undefined;
  }

  // Only applicable if the asset actually exists.
  if (media.type === 'image') {
    return !!images.value.find((i) => i.sum === media.mediaUUID);
  }

  // Generic prize element only applicable if there are applicable prizes to fill it with.
  if (media.type === 'prize_generic') {
    return !!prizes.data?.filter((p) => isPrizeApplicable(p)).length;
  }

  // Check if prize is applicable using other function.
  if (media.type === 'prize') {
    return isPrizeApplicable(prizes.data?.find((p) => p.id.toString() === media.mediaUUID));
  }

  // Text is always applicable.
  return media.type === 'text';
}

function parseSeconds(i: number): void {
  store.newRotation[i].seconds = Number(store.newRotation[i].seconds);
}

function save(): void {
  const index = store.newRotation.findIndex((v) => v.id === editingElem.value);

  if (index >= 0) {
    store.newRotation[index].text = editedText.value;
  }

  editedText.value = '';
  editingElem.value = '';
  dialog.value = false;
}

function remove(i: number): void {
  store.newRotation.splice(i, 1);
}
</script>

<template>
  <div v-if="settings.data && prizes.data">
    <!-- Dialog for editing custom text -->
    <v-dialog class="Dialog" v-model="dialog" persistent>
      <v-card>
        <div class="pa-4 pb-0">
          Text entered here can include Markdown for styling purposes.
        </div>
        <v-card-text class="pa-4 pb-0">
          <v-form>
            <v-textarea
              v-model="editedText"
              label="Text"
              autocomplete="off"
              filled
              dense
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
        <v-spacer />
        <v-btn @click="save">Save</v-btn>
        <v-btn @click="dialog = false; editedText = ''; editingElem = ''">Cancel</v-btn>
      </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar-title>
      Rotation
    </v-toolbar-title>
    <div
      :style="{
        'max-height': '400px',
        'overflow-y': 'auto',
      }"
    >
      <MediaCard
        v-if="!store.newRotation.length"
        :style="{ 'font-style': 'italic' }"
      >
        Drag elements from above to here to configure.
      </MediaCard>
      <Draggable
        v-model="store.newRotation"
        group="media"
        item-key="id"
      >
        <template #item="{ element: media, index: i }">
          <MediaCard
            class="d-flex"
          >
            <ApplicableIcon :is-applicable="isApplicable(media)" />
            <div
              class="d-flex align-center justify-center flex-grow-1"
              :title="getMediaDetails(media).name"
              :style="{
              'overflow': 'hidden',
              'font-weight': media.type === 'prize_generic' ? '500' : undefined,
              'font-style': !getMediaDetails(media).name ? 'italic' : undefined,
            }"
            >
              {{ getMediaDetails(media).name || 'Could not find media name.' }}
            </div>
            <div class="d-flex">
              <v-tooltip left>
                <template v-slot:activator="{ targetRef }">
                  <div v-on="targetRef">
                    <v-checkbox
                      v-on="targetRef"
                      v-model="media.showOnIntermission"
                      dense
                      class="ma-0 pa-0"
                      hide-details
                    />
                  </div>
                </template>
                <span>Show On Intermission</span>
              </v-tooltip>
              <v-text-field
                v-model="media.seconds"
                class="pa-0 ma-0"
                type="number"
                label="Seconds"
                hide-details="auto"
                density="compact"
                :style="{ 'width': '90px !important' }"
                @input="parseSeconds(i)"
              />
              <v-icon
                v-if="media.type === 'text'"
                @click="editingElem = media.id; editedText = media.text || ''; dialog = true"
              >
                mdi-pencil
              </v-icon>
              <v-icon @click="remove(i)">
                mdi-delete
              </v-icon>
            </div>
          </MediaCard>
        </template>
      </Draggable>
    </div>
  </div>
</template>
