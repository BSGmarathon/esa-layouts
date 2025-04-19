<script setup lang="ts">
import { ref } from 'vue';
import { useOmnibarStore } from '../store';

const { id } = defineProps<{ id: string }>();

const store = useOmnibarStore();
const fab = ref(false);

function edit() {
  store.editItemId = id;
  store.editDialog = true;
}

function del() {
  store.deleteItem(id);
}
</script>
<template>
  <v-speed-dial v-model="fab" top right direction="left" absolute>
    <template v-slot:activator>
      <v-btn v-model="fab" color="blue darken-2" fab x-small>
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-btn fab x-small color="green" @click="edit">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn fab x-small color="red" @click="del">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
