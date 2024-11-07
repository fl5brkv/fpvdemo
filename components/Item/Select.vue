<template>
    <!-- select -->
    <div class="p-4">
      <h1 class="text-xl font-semibold mb-4">Items List</h1>
      <table class="min-w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border-b">Item ID</th>
            <th class="px-4 py-2 border-b">User ID</th>
            <th class="px-4 py-2 border-b">Item Name</th>
            <th class="px-4 py-2 border-b">Category</th>
            <th class="px-4 py-2 border-b">Status</th>
            <th class="px-4 py-2 border-b">Purchase Price</th>
            <th class="px-4 py-2 border-b">Purchase Date</th>
            <th class="px-4 py-2 border-b">Sale Price</th>
            <th class="px-4 py-2 border-b">Sale Date</th>
            <th class="px-4 py-2 border-b">Additional Info</th>
            <th class="px-4 py-2 border-b">Updated At</th>
            <th class="px-4 py-2 border-b">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.itemId">
            <td class="px-4 py-2 border-b">{{ item.itemName }}</td>
            <td class="px-4 py-2 border-b">{{ item.category }}</td>
            <td class="px-4 py-2 border-b">{{ item.status }}</td>
            <td class="px-4 py-2 border-b">{{ item.purchasePrice }}</td>
            <td class="px-4 py-2 border-b">{{ item.purchaseDate }}</td>
            <td class="px-4 py-2 border-b">{{ item.salePrice }}</td>
            <td class="px-4 py-2 border-b">{{ item.saleDate }}</td>
            <td class="px-4 py-2 border-b">{{ item.additionalInfo }}</td>
            <td class="px-4 py-2 border-b">
              <button
                @click="selectItem(item)"
                class="text-blue-500 hover:underline">
                Edit
              </button>
            </td>
            <td class="px-4 py-2 border-b">
              <button
                @click="deleteItem(item.itemId)"
                class="text-blue-500 hover:underline">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="selectedItem">
        <ItemUpdate :selected-item="selectedItem"></ItemUpdate>
      </div>
    </div>
  
    <span v-if="res">{{ res }}</span>
    <span v-if="error">{{ error }}</span>
  </template>
  
  <script setup lang="ts">
  import type {z} from 'zod';
  import type {selectItemSchema} from '~/server/database/schemas/tables/items';
  
  const {res, items, error, deleteItem} = await useItem();
  
  const selectedItem = ref<z.infer<typeof selectItemSchema> | null>(null);
  
  const selectItem = (item: z.infer<typeof selectItemSchema>) => {
    selectedItem.value = {...item};
  };
  </script>
  