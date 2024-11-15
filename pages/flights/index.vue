<template>
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold">Your flights</h1>
    <NuxtLink
      to="/flights/create"
      class="text-blue-600 hover:text-blue-800 font-medium">
      New flight
    </NuxtLink>
  </div>

  <div
    v-if="flights?.length === 0"
    class="text-center text-gray-500 p-6 rounded-lg border border-gray-200">
    No flights available.
  </div>

  <div
    v-for="flight in flights"
    :key="flight.flightId"
    class="p-6 rounded-lg border border-gray-200 mb-4">
    <!-- Flight Info -->
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-semibold text-gray-700 truncate">
        {{ flight.flightName }}
      </h2>
      <span class="text-sm font-medium px-2 py-1 rounded">
        {{ flight.purpose }}
      </span>
    </div>

    <p class="text-sm text-gray-500 mb-2" v-show="flight.location">
      Flight location
      <span class="font-semibold">{{ flight.location }}</span>
    </p>
    <p class="text-sm text-gray-500 mb-2" v-show="flight.datetimeStart">
      Start Date & Time:
      <span class="font-semibold">{{ formatDate(flight.datetimeStart) }}</span>
    </p>
    <p class="text-sm text-gray-500 mb-2" v-show="flight.datetimeEnd">
      End Date & Time:
      <span class="font-semibold">{{ formatDate(flight.datetimeEnd) }}</span>
    </p>
    <p class="text-sm text-gray-500 mb-2" v-show="flight.numberOfFlights">
      Number of Flights:
      <span class="font-semibold">{{ flight.numberOfFlights }}</span>
    </p>
    <p class="text-sm text-gray-500 mb-2" v-show="flight.timeInAir">
      Time in Air:
      <span class="font-semibold">{{ flight.timeInAir }} minutes</span>
    </p>
    <p class="text-sm text-gray-500 mb-2" v-show="flight.additionalInfo">
      Additional info
      <span class="font-semibold">{{ flight.additionalInfo }}</span>
    </p>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <NuxtLink
        :to="`/flights/update/${flight.flightId}`"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Edit ✏️
      </NuxtLink>

      <button
        @click="deleteFlight(flight.flightId)"
        class="text-red-600 hover:text-red-800 text-sm font-medium">
        Delete 🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

const {flights, deleteFlight} = await useFlight();
</script>
