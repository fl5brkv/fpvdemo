<template>
  <div v-for="item in items">
    <span>{{ item.itemName }}</span>
    <NuxtLink
      :to="`/items/update/${item.publicItemId}`"
      class="text-blue-500 hover:underline">
      Edit - {{ item.publicItemId }}
    </NuxtLink>

    <button
      @click="deleteItem(item.itemId)"
      class="text-blue-500 hover:underline">
      Delete
    </button>
  </div>
  {{loggedIn}}
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});

const {loggedIn} = useUserSession();

const {items, deleteItem} = await useItem();
</script>
