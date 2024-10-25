<template>
  <form @submit="onSubmit">
    <input type="text" v-model="itemName" v-bind="itemNameAttrs" />
    <div>{{ errors.itemName }}</div>

    <select v-model="category" v-bind="categoryAttrs">
      <option v-for="cat in category" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>
    <div>{{ errors.category }}</div>

    <select v-model="status" v-bind="statusAttrs">
      <option v-for="stat in status" :key="stat" :value="stat">
        {{ stat }}
      </option>
    </select>
    <div>{{ errors.status }}</div>

    <input type="number" v-model="purchasePrice" v-bind="purchasePriceAttrs" />
    <div>{{ errors.purchasePrice }}</div>

    <input type="date" v-model="purchaseDate" v-bind="purchaseDateAttrs" />
    <div>{{ errors.purchaseDate }}</div>

    <input type="number" v-model="salePrice" v-bind="salePriceAttrs" />
    <div>{{ errors.salePrice }}</div>

    <input type="date" v-model="saleDate" v-bind="saleDateAttrs" />
    <div>{{ errors.saleDate }}</div>

    <textarea v-model="additionalInfo" v-bind="additionalInfoAttrs"></textarea>
    <div>{{ errors.additionalInfo }}</div>

    <button :disabled="isSubmitting || submitCount > 5">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>
  </form>

  <span v-if="error">{{ error }}</span>
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
