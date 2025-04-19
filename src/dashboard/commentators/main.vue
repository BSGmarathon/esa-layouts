<script setup lang="ts">
import { commentatorsNew } from '@esa-layouts/browser_shared/replicant_store';
import { ref } from 'vue';
import { useHead } from '@vueuse/head';

useHead({ title: 'Commentators' });

const nameEntry = ref('');
const disable = ref(false);

async function add(): Promise<void> {
  disable.value = true;
  try {
    await nodecg.sendMessage('commentatorAdd', nameEntry.value);
  } catch (err) {
    // catch
  }
  disable.value = false;
  nameEntry.value = '';
}

async function del(index: number): Promise<void> {
  disable.value = true;
  try {
    await nodecg.sendMessage('commentatorRemove', index);
  } catch (err) {
    // catch
  }
  disable.value = false;
}

function clear() {
  commentatorsNew.data = [];
  commentatorsNew.save();
}
</script>

<template>
  <v-app v-if="commentatorsNew.data">
    <v-card
      :style="{ 'margin-bottom': '10px' }"
      tile
    >
      <v-list
        dense
      >
        <v-list-item-group>
          <template v-if="commentatorsNew.data.length">
            <v-list-item
              v-for="({ name, country, pronouns }, i) in commentatorsNew.data"
              :key="i"
            >
              <v-list-item-action>
                <v-icon @click="del(i)">mdi-delete</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                {{ name }}
                <template v-if="pronouns">
                  ({{ pronouns }})
                </template>
                <template v-if="country">
                  ({{ country }})
                </template>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list-item
            v-else
            :style="{ 'font-style': 'italic' } "
          >
            No commentators specified
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
        :disabled="disable"
        @keyup.enter="add"
      />
      <v-btn
        height="56px"
        :style="{ 'min-width': '0', 'margin-left': '5px' }"
        :disabled="disable"
        @click="add"
      >
        <v-icon>mdi-check</v-icon>
      </v-btn>
    </div>
    <v-btn
      :style="{ 'margin-top': '10px' }"
      :disabled="disable"
      @click="clear"
    >
      Manual Clear
    </v-btn>
  </v-app>
</template>
