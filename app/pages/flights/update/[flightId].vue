<template>
  <form
    @submit.prevent="onSubmit"
    class="max-w-md mx-auto p-4 rounded-lg border border-gray-300">
    <div class="mb-4">
      <label for="flightName" class="block text-sm font-medium text-gray-700"
        >Flight Name</label
      >
      <input
        id="flightName"
        type="text"
        v-model="flightName"
        v-bind="flightNameAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter flight name" />
      <div v-if="errors.flightName" class="text-xs text-red-600 mt-1">
        {{ errors.flightName }}
      </div>
    </div>

    <!-- Date -->
    <div class="mb-4">
      <label for="date" class="block text-sm font-medium text-gray-700"
        >Date</label
      >
      <input
        id="date"
        type="date"
        v-model="date"
        v-bind="dateAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      <div v-if="errors.date" class="text-xs text-red-600 mt-1">
        {{ errors.date }}
      </div>
    </div>

    <!-- Location -->
    <div class="mb-4">
      <label for="location" class="block text-sm font-medium text-gray-700"
        >Location</label
      >
      <input
        id="location"
        type="text"
        v-model="location"
        v-bind="locationAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter location" />
      <div v-if="errors.location" class="text-xs text-red-600 mt-1">
        {{ errors.location }}
      </div>
    </div>

    <!-- Landings -->
    <div class="mb-4">
      <label for="landings" class="block text-sm font-medium text-gray-700"
        >Landings</label
      >
      <input
        id="landings"
        type="number"
        v-model="landings"
        v-bind="landingsAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter number of flights" />
      <div v-if="errors.landings" class="text-xs text-red-600 mt-1">
        {{ errors.landings }}
      </div>
    </div>

    <!-- Time in Air -->
    <div class="mb-4">
      <label for="timeInAir" class="block text-sm font-medium text-gray-700"
        >Time in Air (minutes)</label
      >
      <input
        id="timeInAir"
        type="number"
        v-model="timeInAir"
        v-bind="timeInAirAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter time in air" />
      <div v-if="errors.timeInAir" class="text-xs text-red-600 mt-1">
        {{ errors.timeInAir }}
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mb-6">
      <label
        for="additionalInfo"
        class="block text-sm font-medium text-gray-700"
        >Additional Info</label
      >
      <textarea
        id="additionalInfo"
        v-model="additionalInfo"
        v-bind="additionalInfoAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter additional information"></textarea>
      <div v-if="errors.additionalInfo" class="text-xs text-red-600 mt-1">
        {{ errors.additionalInfo }}
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="isSubmitting || submitCount > 5"
      class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>

    <!-- Response & Error Messages -->
    <div v-if="res" class="text-green-600 mt-4">{{ res }}</div>
    <div v-if="error" class="text-red-600 mt-4">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

import {useForm} from 'vee-validate';

import {toTypedSchema} from '@vee-validate/zod';
import {flightUpdateSchema} from '~~/server/database/schema/tables/flights';

const {res, flights, updateFlight, error} = await useFlight();

const route = useRoute();

const selectedFlight = computed(() => {
  return flights.value?.find(
    (flight) => flight.flightId === Number(route.params.flightId)
  );
});

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  initialValues: {
    flightId: selectedFlight.value?.flightId,
    flightName: selectedFlight.value?.flightName,
    date: selectedFlight.value?.date,
    location: selectedFlight.value?.location,
    landings: selectedFlight.value?.landings,
    timeInAir: selectedFlight.value?.timeInAir,
    additionalInfo: selectedFlight.value?.additionalInfo,
  },
  validationSchema: toTypedSchema(flightUpdateSchema),
});

const [flightName, flightNameAttrs] = defineField('flightName');
const [date, dateAttrs] = defineField('date');
const [location, locationAttrs] = defineField('location');
const [landings, landingsAttrs] = defineField('landings');
const [timeInAir, timeInAirAttrs] = defineField('timeInAir');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  await updateFlight(values);
});
</script>
