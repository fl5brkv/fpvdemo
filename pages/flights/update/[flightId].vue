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

    <!-- Start Date & Time -->
    <div class="mb-4">
      <label for="datetimeStart" class="block text-sm font-medium text-gray-700"
        >Start Date & Time</label
      >
      <input
        id="datetimeStart"
        type="datetime-local"
        v-model="datetimeStart"
        v-bind="datetimeStartAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      <div v-if="errors.datetimeStart" class="text-xs text-red-600 mt-1">
        {{ errors.datetimeStart }}
      </div>
    </div>

    <!-- End Date & Time -->
    <div class="mb-4">
      <label for="datetimeEnd" class="block text-sm font-medium text-gray-700"
        >End Date & Time</label
      >
      <input
        id="datetimeEnd"
        type="datetime-local"
        v-model="datetimeEnd"
        v-bind="datetimeEndAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      <div v-if="errors.datetimeEnd" class="text-xs text-red-600 mt-1">
        {{ errors.datetimeEnd }}
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

    <!-- Number of Flights -->
    <div class="mb-4">
      <label
        for="numberOfFlights"
        class="block text-sm font-medium text-gray-700"
        >Number of Flights</label
      >
      <input
        id="numberOfFlights"
        type="number"
        v-model="numberOfFlights"
        v-bind="numberOfFlightsAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter number of flights" />
      <div v-if="errors.numberOfFlights" class="text-xs text-red-600 mt-1">
        {{ errors.numberOfFlights }}
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

    <!-- Purpose -->
    <div class="mb-4">
      <label for="purpose" class="block text-sm font-medium text-gray-700"
        >Purpose</label
      >
      <select
        id="purpose"
        v-model="purpose"
        v-bind="purposeAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option value="" disabled selected>Select a purpose</option>
        <option v-for="pur in purposes" :key="pur" :value="pur">
          {{ pur }}
        </option>
      </select>
      <div v-if="errors.purpose" class="text-xs text-red-600 mt-1">
        {{ errors.purpose }}
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
import {updateFlightSchema} from '~/server/database/schemas/tables/flights';

const {res, flights, updateFlight, error} = await useFlight();

const route = useRoute();

const selectedFlight = computed(() => {
  return flights.value?.find(
    (flight) => flight.flightId === Number(route.params.flightId)
  );
});

const purposes = [
  'recreational',
  'testing',
  'filming',
  'photography',
  'racing',
  'surveying',
  'inspection',
  'commercial delivery',
  'search and rescue',
  'agriculture',
  'mapping',
  'other',
] as const;

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  initialValues: {
    flightId: selectedFlight.value?.flightId,
    flightName: selectedFlight.value?.flightName,
    datetimeStart: selectedFlight.value?.datetimeStart,
    datetimeEnd: selectedFlight.value?.datetimeEnd,
    location: selectedFlight.value?.location,
    numberOfFlights: selectedFlight.value?.numberOfFlights,
    timeInAir: selectedFlight.value?.timeInAir,
    purpose: selectedFlight.value?.purpose,
    additionalInfo: selectedFlight.value?.additionalInfo,
  },
  validationSchema: toTypedSchema(updateFlightSchema),
});

const [flightName, flightNameAttrs] = defineField('flightName');
const [datetimeStart, datetimeStartAttrs] = defineField('datetimeStart');
const [datetimeEnd, datetimeEndAttrs] = defineField('datetimeEnd');
const [location, locationAttrs] = defineField('location');
const [numberOfFlights, numberOfFlightsAttrs] = defineField('numberOfFlights');
const [timeInAir, timeInAirAttrs] = defineField('timeInAir');
const [purpose, purposeAttrs] = defineField('purpose');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  await updateFlight(values);
});
</script>
