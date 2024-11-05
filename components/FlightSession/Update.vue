<template>
  <form
    @submit.prevent="onSubmit"
    class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Start Date & Time</label
      >
      <input
        type="datetime-local"
        v-model="datetimeStart"
        v-bind="datetimeStartAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full" />
      <div class="text-red-500 text-sm">{{ errors.datetimeStart }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >End Date & Time</label
      >
      <input
        type="datetime-local"
        v-model="datetimeEnd"
        v-bind="datetimeEndAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full" />
      <div class="text-red-500 text-sm">{{ errors.datetimeEnd }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Location</label>
      <input
        type="text"
        v-model="location"
        v-bind="locationAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter location" />
      <div class="text-red-500 text-sm">{{ errors.location }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Number of Flights</label
      >
      <input
        type="number"
        v-model="numberOfFlights"
        v-bind="numberOfFlightsAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter number of flights" />
      <div class="text-red-500 text-sm">{{ errors.numberOfFlights }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Time in Air (minutes)</label
      >
      <input
        type="number"
        v-model="timeInAir"
        v-bind="timeInAirAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter time in air" />
      <div class="text-red-500 text-sm">{{ errors.timeInAir }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Purpose</label>
      <select
        v-model="purpose"
        v-bind="purposeAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full">
        <option value="" disabled selected>Select a purpose</option>
        <option v-for="pur in purposes" :key="pur" :value="pur">
          {{ pur }}
        </option>
      </select>
      <div class="text-red-500 text-sm">{{ errors.purpose }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Additional Info</label
      >
      <textarea
        v-model="additionalInfo"
        v-bind="additionalInfoAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter additional information"></textarea>
      <div class="text-red-500 text-sm">{{ errors.additionalInfo }}</div>
    </div>

    <button
      type="submit"
      :disabled="isSubmitting || submitCount > 5"
      class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>

    <span v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</span>
  </form>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';

const {updateFlightSession, error} = await useFlightSession();

import type {z} from 'zod';
import {
  updateFlightSessionSchema,
  type selectFlightSessionSchema,
} from '~/server/database/schemas/tables/flightSessions';

const props = defineProps<{
  selectedFlightSession: z.infer<typeof selectFlightSessionSchema> | null;
}>();

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

const {handleSubmit, errors, defineField, isSubmitting, submitCount, values} =
  useForm({
    initialValues: {
      flightSessionId: props.selectedFlightSession?.flightSessionId,
      datetimeStart: props.selectedFlightSession?.datetimeStart,
      datetimeEnd: props.selectedFlightSession?.datetimeEnd,
      location: props.selectedFlightSession?.location,
      numberOfFlights: props.selectedFlightSession?.numberOfFlights,
      timeInAir: props.selectedFlightSession?.timeInAir,
      purpose: props.selectedFlightSession?.purpose,
      additionalInfo: props.selectedFlightSession?.additionalInfo,
    },
    validationSchema: toTypedSchema(updateFlightSessionSchema),
  });

const [datetimeStart, datetimeStartAttrs] = defineField('datetimeStart');
const [datetimeEnd, datetimeEndAttrs] = defineField('datetimeEnd');
const [location, locationAttrs] = defineField('location');
const [numberOfFlights, numberOfFlightsAttrs] = defineField('numberOfFlights');
const [timeInAir, timeInAirAttrs] = defineField('timeInAir');
const [purpose, purposeAttrs] = defineField('purpose');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  updateFlightSession(values);
});
</script>
