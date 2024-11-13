<template>
  <h1 class="text-3xl font-semibold mb-6">All items</h1>

  <!-- Items List -->
  <div class="space-y-4">
    <div
      v-for="item in items"
      :key="item.itemId"
      class="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-300">
      <!-- Item Details -->
      <div class="flex-1">
        <h2 class="font-bold text-xl">{{ item.itemName }}</h2>
        <p class="text-sm text-gray-500">Category: {{ item.category }}</p>
        <p class="text-sm text-gray-500">
          Status:
          <span>{{ item.status }}</span>
        </p>
      </div>
      
      <!-- Edit and Delete Links -->
      <div class="flex items-center space-x-4">
        <NuxtLink
          :to="`/items/update/${item.publicItemId}`"
          class="text-blue-500 hover:text-blue-700">
          Edit ✏️
        </NuxtLink>

        <button
          @click="deleteItem(item.itemId)"
          class="text-red-500 hover:text-red-700">
          Delete 🗑️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

const {items, deleteItem} = await useItem();
</script>
