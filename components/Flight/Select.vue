<template>
  <div v-for="flightSession in flightSessions">
    {{ flightSession }}
    <button
      @click="selectFlightSession(flightSession)"
      class="text-blue-500 hover:underline">
      Edit
    </button>
    <button
      @click="deleteFlightSession(flightSession.flightSessionId)"
      class="text-blue-500 hover:underline">
      Delete
    </button>
  </div>
  <div v-if="selectedFlightSession">
    <FlightUpdate :selected-flight-session="selectedFlightSession" />
  </div>

  <span v-if="res">{{ res }}</span>

  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import type {z} from 'zod';
import type {selectFlightSessionSchema} from '~/server/database/schemas/tables/flightSessions';

const {res, flightSessions, error, deleteFlightSession} =
  await useFlightSession();

const selectedFlightSession = ref<z.infer<
  typeof selectFlightSessionSchema
> | null>(null);

const selectFlightSession = (
  flightSession: z.infer<typeof selectFlightSessionSchema>
) => {
  selectedFlightSession.value = {...flightSession};
};
</script>
