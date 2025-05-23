<script setup lang="ts">
defineProps<{ isApplicable: boolean | undefined }>();
</script>

<template>
  <v-tooltip
    v-if="isApplicable"
    right
  >
    <template v-slot:activator="{ targetRef }">
      <v-icon v-on="targetRef">
        mdi-check
      </v-icon>
    </template>
    <span>Applicable</span>
  </v-tooltip>
  <v-tooltip
    v-else-if="!isApplicable"
    right
  >
    <template v-slot:activator="{ targetRef }">
      <v-icon v-on="targetRef">
        mdi-close
      </v-icon>
    </template>
    <span>Not Currently Applicable</span>
  </v-tooltip>
  <v-tooltip
    v-else
    right
  >
    <template v-slot:activator="{ targetRef }">
      <v-icon v-on="targetRef">
        mdi-help
      </v-icon>
    </template>
    <span>Unknown</span>
  </v-tooltip>
</template>
