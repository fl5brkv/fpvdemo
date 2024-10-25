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
      <label class="block text-sm font-medium text-gray-700">Latitude</label>
      <input
        type="number"
        v-model="lat"
        v-bind="latAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter latitude" />
      <div class="text-red-500 text-sm">{{ errors.lat }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Longitude</label>
      <input
        type="number"
        v-model="lng"
        v-bind="lngAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter longitude" />
      <div class="text-red-500 text-sm">{{ errors.lng }}</div>
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
import {useForm, useFieldArray} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {z} from 'zod';

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

const {
  handleSubmit,
  errors,
  defineField,
  isSubmitting,
  resetForm,
  submitCount,
  values,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      datetimeStart: z.string().optional(),
      datetimeEnd: z.string().optional(),
      location: z.string().optional(),
      lat: z.number().int().optional(),
      lng: z.number().int().optional(),
      numberOfFlights: z.number().int(),
      timeInAir: z.number().int().optional(),
      purpose: z.enum(purposes).optional(),
      additionalInfo: z.string().optional(),
      itemIds: z.array(z.number().int()).optional(),
    })
  ),
});

const [datetimeStart, datetimeStartAttrs] = defineField('datetimeStart');
const [datetimeEnd, datetimeEndAttrs] = defineField('datetimeEnd');
const [location, locationAttrs] = defineField('location');
const [lat, latAttrs] = defineField('lat');
const [lng, lngAttrs] = defineField('lng');
const [numberOfFlights, numberOfFlightsAttrs] = defineField('numberOfFlights');
const [timeInAir, timeInAirAttrs] = defineField('timeInAir');
const [purpose, purposeAttrs] = defineField('purpose');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const error = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/flight-session', {
      method: 'POST',
      body: values,
    });
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
    resetForm();
  }
});
</script>

<!-- <div class="mb-4">
  <label class="block text-sm font-medium text-gray-700">
    Select Item IDs
  </label>
  <div class="flex gap-2 mb-2">
    <button
      v-for="number in predefinedNumbers"
      :key="number"
      @click.prevent="toggleItemId(number)"
      :disabled="itemIds.includes(number)"
      :class="{
        'bg-green-500 text-white': itemIds.includes(number),
        'bg-gray-300 text-gray-700': !itemIds.includes(number),
      }"
      class="px-2 py-1 rounded">
      {{ number }}
    </button>
  </div>
  <div class="text-red-500 text-sm">{{ errors.itemIds }}</div>
</div> -->

<!-- const {fields: itemIds, push, remove} = useFieldArray('itemIds');

const predefinedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const toggleItemId = (id: number) => {
  const index = itemIds.value.findIndex((field) => field.value === id);
  if (index === -1) {
    push(id);
  } else {
    remove(index);
  }
}; -->
