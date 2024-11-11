<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Start Date & Time</label>
      <input
        type="datetime-local"
        v-model="datetimeStart"
        v-bind="datetimeStartAttrs" />
      <div>{{ errors.datetimeStart }}</div>
    </div>

    <div>
      <label>End Date & Time</label>
      <input
        type="datetime-local"
        v-model="datetimeEnd"
        v-bind="datetimeEndAttrs" />
      <div>{{ errors.datetimeEnd }}</div>
    </div>

    <div>
      <label>Location</label>
      <input
        type="text"
        v-model="location"
        v-bind="locationAttrs"
        placeholder="Enter location" />
      <div>{{ errors.location }}</div>
    </div>

    <div>
      <label>Number of Flights</label>
      <input
        type="number"
        v-model="numberOfFlights"
        v-bind="numberOfFlightsAttrs"
        placeholder="Enter number of flights" />
      <div>{{ errors.numberOfFlights }}</div>
    </div>

    <div>
      <label>Time in Air (minutes)</label>
      <input
        type="number"
        v-model="timeInAir"
        v-bind="timeInAirAttrs"
        placeholder="Enter time in air" />
      <div>{{ errors.timeInAir }}</div>
    </div>

    <div>
      <label>Purpose</label>
      <select v-model="purpose" v-bind="purposeAttrs">
        <option value="" disabled selected>Select a purpose</option>
        <option v-for="pur in purposes" :key="pur" :value="pur">
          {{ pur }}
        </option>
      </select>
      <div>{{ errors.purpose }}</div>
    </div>

    <div>
      <label>Additional Info</label>
      <textarea
        v-model="additionalInfo"
        v-bind="additionalInfoAttrs"
        placeholder="Enter additional information"></textarea>
      <div>{{ errors.additionalInfo }}</div>
    </div>

    <button type="submit" :disabled="isSubmitting || submitCount > 5">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>

    <span v-if="res">{{ res }}</span>

    <span v-if="error">{{ error }}</span>
  </form>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';

const {res, updateFlight, error} = await useFlight();

import type {z} from 'zod';
import {
  updateFlightSchema,
  type selectFlightSchema,
} from '~/server/database/schemas/tables/flights';

const props = defineProps<{
  selectedFlight: z.infer<typeof selectFlightSchema> | null;
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
      flightId: props.selectedFlight?.flightId,
      datetimeStart: props.selectedFlight?.datetimeStart,
      datetimeEnd: props.selectedFlight?.datetimeEnd,
      location: props.selectedFlight?.location,
      numberOfFlights: props.selectedFlight?.numberOfFlights,
      timeInAir: props.selectedFlight?.timeInAir,
      purpose: props.selectedFlight?.purpose,
      additionalInfo: props.selectedFlight?.additionalInfo,
    },
    validationSchema: toTypedSchema(updateFlightSchema),
  });

const [datetimeStart, datetimeStartAttrs] = defineField('datetimeStart');
const [datetimeEnd, datetimeEndAttrs] = defineField('datetimeEnd');
const [location, locationAttrs] = defineField('location');
const [numberOfFlights, numberOfFlightsAttrs] = defineField('numberOfFlights');
const [timeInAir, timeInAirAttrs] = defineField('timeInAir');
const [purpose, purposeAttrs] = defineField('purpose');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  updateFlight(values);
});
</script>
