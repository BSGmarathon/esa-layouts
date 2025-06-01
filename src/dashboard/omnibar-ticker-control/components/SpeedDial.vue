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
  <v-speed-dial
    v-model="fab"
    transition="fade-transition"
    location="left center"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        color="blue darken-2"
        v-bind="activatorProps"
        position="absolute"
        size="small"
        location="right center"
        class="speed-dial"
        icon="mdi-close"
      >
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-cog</v-icon>
      </v-btn>
    </template>
    <v-btn key="1"
           icon="mdi-pencil"
           size="x-small"
           color="green"
           @click="edit"
    />
    <v-btn key="2"
           icon="mdi-delete"
           size="x-small"
           color="red"
           @click="del"
    />
  </v-speed-dial>
</template>

<style scoped>
.speed-dial {
  right: 10px !important;
}
</style>
