<template>
  <div v-for="flight in flights">
    <span>{{ flight.location }}</span>
    <NuxtLink
      :to="`/flights/update/${flight.publicFlightId}`"
      class="text-blue-500 hover:underline">
      Edit - {{ flight.publicFlightId }}
    </NuxtLink>

    <button
      @click="deleteFlight(flight.flightId)"
      class="text-blue-500 hover:underline">
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

const {flights, deleteFlight} = await useFlight();
</script>
