<template>
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold">Your items</h1>
    <NuxtLink
      to="/items/create"
      class="text-blue-600 hover:text-blue-800 font-medium"
      >New item</NuxtLink
    >
  </div>

  <div
    v-if="items?.length === 0"
    class="text-center text-gray-500 p-6 rounded-lg border border-gray-200">
    No items available.
  </div>

  <div
    v-for="item in items"
    :key="item.itemId"
    class="p-6 rounded-lg border border-gray-200 mb-4">
    <!-- Item Info -->
    <div class="flex justify-between mb-4">
      <h2 class="text-2xl font-semibold text-gray-700 truncate">
        {{ item.itemName }}
      </h2>
      <span class="text-sm font-medium px-2 py-1 rounded">
        {{ item.category }}
      </span>
    </div>
    <p class="text-sm text-gray-500 mb-2" v-show="item.status">
      Status: <span class="font-semibold">{{ item.status }}</span>
    </p>
    <p class="text-sm text-gray-500 mb-4" v-show="item.additionalInfo">
      Additional Info:
      <span class="font-semibold">{{ item.additionalInfo || 'N/A' }}</span>
    </p>

    <!-- Actions -->
    <div class="flex justify-between items-center">
      <NuxtLink
        :to="`/items/update/${item.itemId}`"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Edit ✏️
      </NuxtLink>

      <button
        @click="deleteItem({itemId: item.itemId})"
        class="text-red-600 hover:text-red-800 text-sm font-medium">
        Delete 🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

const {items, deleteItem} = await useItem();
</script>
