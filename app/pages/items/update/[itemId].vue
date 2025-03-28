<template>
  <form
    @submit.prevent="onSubmit"
    class="max-w-md mx-auto p-4 rounded-lg border border-gray-300">
    <!-- Item Name -->
    <div class="mb-4">
      <label for="itemName" class="block text-sm font-medium text-gray-700"
        >Item Name</label
      >
      <input
        id="itemName"
        type="text"
        v-model="itemName"
        v-bind="itemNameAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="Enter item name" />
      <div v-if="errors.itemName" class="text-xs text-red-600 mt-1">
        {{ errors.itemName }}
      </div>
    </div>

    <!-- Category -->
    <div class="mb-4">
      <label for="category" class="block text-sm font-medium text-gray-700"
        >Category</label
      >
      <select
        id="category"
        v-model="categoryField"
        v-bind="categoryAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option value="" disabled selected>Select a category</option>
        <option v-for="cat in category" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <div v-if="errors.category" class="text-xs text-red-600 mt-1">
        {{ errors.category }}
      </div>
    </div>

    <!-- Status -->
    <div class="mb-4">
      <label for="status" class="block text-sm font-medium text-gray-700"
        >Status</label
      >
      <select
        id="status"
        v-model="statusField"
        v-bind="statusAttrs"
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
        <option value="" disabled selected>Select a status</option>
        <option v-for="stat in status" :key="stat" :value="stat">
          {{ stat }}
        </option>
      </select>
      <div v-if="errors.status" class="text-xs text-red-600 mt-1">
        {{ errors.status }}
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
import {itemUpdateSchema} from '~~/server/database/schema/tables/items';

const {res, items, updateItem, error} = await useItem();

const route = useRoute();

const selectedItem = computed(() => {
  return items.value?.find(
    (item) => item.itemId === Number(route.params.itemId)
  );
});

const category = [
  'goggles',
  'radio (TX)',
  'goggles', // contains video receiver (VRX)
  'action camera',
  'ND filters',
  'SD card',
  'SSD',
  'USB drive',
  'battery charger',
  'charger accessories',
  'LiPo bag',
  'toolkit',
  'game',
  'drone',
  'battery',
  'frame',
  'motors',
  'props',
  'FC',
  'ESC',
  'AIO (FC + ESC)',
  'GPS',
  'receiver (RX)',
  'transmitter (VTX)',
  'other',
] as const;

const status = [
  'new',
  'active',
  'inactive',
  'damaged',
  'sold',
  'discarded',
] as const;

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  initialValues: {
    itemId: selectedItem.value?.itemId,
    itemName: selectedItem.value?.itemName,
    category: selectedItem.value?.category,
    status: selectedItem.value?.status,
    additionalInfo: selectedItem.value?.additionalInfo,
  },
  validationSchema: toTypedSchema(itemUpdateSchema),
});

const [itemName, itemNameAttrs] = defineField('itemName');
const [categoryField, categoryAttrs] = defineField('category');
const [statusField, statusAttrs] = defineField('status');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  updateItem(values);
});
</script>
