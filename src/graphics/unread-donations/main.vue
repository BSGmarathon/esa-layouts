<script setup lang="ts">
import { donationsToRead } from '@esa-layouts/browser_shared/replicant_store';
import Donation from './components/Donation.vue';
</script>

<template>
  <div>
    <h1>Unread Donations</h1>
    <div
      v-if="!donationsToRead.length"
      :style="{ 'font-size': '30px', 'font-style': 'italic' }"
    >
      None right now!
    </div>
    <Donation
      v-for="(donation, index) in donationsToRead"
      :key="donation.id"
      :data="donation"
      :index="index"
    />
  </div>
</template>

<style>
  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #212121;
    color: white;
    overflow: hidden;
    text-align: center;
  }
</style>
