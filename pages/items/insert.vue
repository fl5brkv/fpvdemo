<template>
  <form
    @submit.prevent="onSubmit"
    class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Item Name</label>
      <input
        type="text"
        v-model="itemName"
        v-bind="itemNameAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter item name" />
      <div class="text-red-500 text-sm">{{ errors.itemName }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Category</label>
      <select
        v-model="categoryField"
        v-bind="categoryAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full">
        <option value="" disabled selected>Select a category</option>
        <option v-for="cat in category" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <div class="text-red-500 text-sm">{{ errors.category }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Status</label>
      <select
        v-model="statusField"
        v-bind="statusAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full">
        <option value="" disabled selected>Select a status</option>
        <option v-for="stat in status" :key="stat" :value="stat">
          {{ stat }}
        </option>
      </select>
      <div class="text-red-500 text-sm">{{ errors.status }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Purchase Price</label
      >
      <input
        type="number"
        v-model="purchasePrice"
        v-bind="purchasePriceAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter purchase price" />
      <div class="text-red-500 text-sm">{{ errors.purchasePrice }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700"
        >Purchase Date</label
      >
      <input
        type="datetime-local"
        v-model="purchaseDate"
        v-bind="purchaseDateAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full" />
      <div class="text-red-500 text-sm">{{ errors.purchaseDate }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Sale Price</label>
      <input
        type="number"
        v-model="salePrice"
        v-bind="salePriceAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full"
        placeholder="Enter sale price" />
      <div class="text-red-500 text-sm">{{ errors.salePrice }}</div>
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Sale Date</label>
      <input
        type="datetime-local"
        v-model="saleDate"
        v-bind="saleDateAttrs"
        class="mt-1 p-2 border border-gray-300 rounded w-full" />
      <div class="text-red-500 text-sm">{{ errors.saleDate }}</div>
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
import {z} from 'zod';

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

const {
  handleSubmit,
  errors,
  defineField,
  isSubmitting,
  resetForm,
  submitCount,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      itemName: z.string().min(1),
      category: z.enum(category),
      status: z.enum(status).optional(),
      purchasePrice: z.number().int().positive().optional(),
      purchaseDate: z.string().optional(),
      salePrice: z.number().int().positive().optional(),
      saleDate: z.string().optional(),
      additionalInfo: z.string().optional(),
    })
  ),
});

const [itemName, itemNameAttrs] = defineField('itemName');
const [categoryField, categoryAttrs] = defineField('category');
const [statusField, statusAttrs] = defineField('status');
const [purchasePrice, purchasePriceAttrs] = defineField('purchasePrice');
const [purchaseDate, purchaseDateAttrs] = defineField('purchaseDate');
const [salePrice, salePriceAttrs] = defineField('salePrice');
const [saleDate, saleDateAttrs] = defineField('saleDate');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const error = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/item', {
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
