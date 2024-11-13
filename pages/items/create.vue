<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>Item name</label>
      <input type="text" v-model="itemName" v-bind="itemNameAttrs" />
      <div>{{ errors.itemName }}</div>
    </div>

    <div>
      <label>Category</label>
      <select v-model="category" v-bind="categoryAttrs">
        <option value="" disabled selected>Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      <div>{{ errors.category }}</div>
    </div>

    <div>
      <label>Status</label>
      <select v-model="status" v-bind="statusAttrs">
        <option value="" disabled selected>Select a status</option>
        <option v-for="stat in statuses" :key="stat" :value="stat">
          {{ stat }}
        </option>
      </select>
      <div>{{ errors.status }}</div>
    </div>

    <div>
      <label>Purchase price</label>
      <input
        type="number"
        v-model="purchasePrice"
        v-bind="purchasePriceAttrs" />
      <div>{{ errors.purchasePrice }}</div>
    </div>

    <div>
      <label>Purchase date</label>
      <input
        type="datetime-local"
        v-model="purchaseDate"
        v-bind="purchaseDateAttrs"
        placeholder="Enter location" />
      <div>{{ errors.purchaseDate }}</div>
    </div>

    <div>
      <label>Sale price</label>
      <input
        type="number"
        v-model="salePrice"
        v-bind="salePriceAttrs"
        placeholder="Enter number of flights" />
      <div>{{ errors.salePrice }}</div>
    </div>

    <div>
      <label>Sale date</label>
      <input
        type="datetime-local"
        v-model="saleDate"
        v-bind="saleDateAttrs"
        placeholder="Enter time in air" />
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
import {insertItemSchema} from '~/server/database/schemas/tables/items';
const {res, insertItem, error} = await useItem();

const categories = [
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

const statuses = [
  'new',
  'active',
  'inactive',
  'damaged',
  'sold',
  'discarded',
] as const;

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(insertItemSchema),
});

const [itemName, itemNameAttrs] = defineField('itemName');
const [category, categoryAttrs] = defineField('category');
const [status, statusAttrs] = defineField('status');
const [purchasePrice, purchasePriceAttrs] = defineField('purchasePrice');
const [purchaseDate, purchaseDateAttrs] = defineField('purchaseDate');
const [salePrice, salePriceAttrs] = defineField('salePrice');
const [saleDate, saleDateAttrs] = defineField('saleDate');
const [additionalInfo, additionalInfoAttrs] = defineField('additionalInfo');

const onSubmit = handleSubmit(async (values) => {
  insertItem(values);
});
</script>
