<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Item Name</label>
      <input
        type="text"
        v-model="itemName"
        v-bind="itemNameAttrs"
        placeholder="Enter item name" />
      <div>{{ errors.itemName }}</div>
    </div>

    <div>
      <label>Category</label>
      <select v-model="categoryField" v-bind="categoryAttrs">
        <option value="" disabled selected>Select a category</option>
        <option v-for="cat in category" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <div>{{ errors.category }}</div>
    </div>

    <div>
      <label>Status</label>
      <select v-model="statusField" v-bind="statusAttrs">
        <option value="" disabled selected>Select a status</option>
        <option v-for="stat in status" :key="stat" :value="stat">
          {{ stat }}
        </option>
      </select>
      <div>{{ errors.status }}</div>
    </div>

    <div>
      <label>Purchase Price</label>
      <input
        type="number"
        v-model="purchasePrice"
        v-bind="purchasePriceAttrs"
        placeholder="Enter purchase price" />
      <div>{{ errors.purchasePrice }}</div>
    </div>

    <div>
      <label>Purchase Date</label>
      <input
        type="datetime-local"
        v-model="purchaseDate"
        v-bind="purchaseDateAttrs" />
      <div>{{ errors.purchaseDate }}</div>
    </div>

    <div>
      <label>Sale Price</label>
      <input
        type="number"
        v-model="salePrice"
        v-bind="salePriceAttrs"
        placeholder="Enter sale price" />
      <div>{{ errors.salePrice }}</div>
    </div>

    <div>
      <label>Sale Date</label>
      <input type="datetime-local" v-model="saleDate" v-bind="saleDateAttrs" />
      <div>{{ errors.saleDate }}</div>
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
import {updateItemSchema} from '~/server/database/schemas/tables/items';

const {res, items, updateItem, error} = await useItem();

const route = useRoute();

const selectedItem = computed(() => {
  return items.value?.find(
    (item) => item.publicItemId === route.params.publicItemId
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
    purchasePrice: selectedItem.value?.purchasePrice,
    purchaseDate: selectedItem.value?.purchaseDate,
    salePrice: selectedItem.value?.salePrice,
    saleDate: selectedItem.value?.saleDate,
    additionalInfo: selectedItem.value?.additionalInfo,
  },
  validationSchema: toTypedSchema(updateItemSchema),
});

const [itemName, itemNameAttrs] = defineField('itemName');
const [categoryField, categoryAttrs] = defineField('category');
const [statusField, statusAttrs] = defineField('status');
const [purchasePrice, purchasePriceAttrs] = defineField('purchasePrice');
const [purchaseDate, purchaseDateAttrs] = defineField('purchaseDate');
const [salePrice, salePriceAttrs] = defineField('salePrice');
const [saleDate, saleDateAttrs] = defineField('saleDate');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  updateItem(values);
});
</script>
