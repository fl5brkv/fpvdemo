<template>
  <header class="w-full bg-gray-50 p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <NuxtLink to="/" class="text-2xl font-bold text-gray-800"
          >MyApp</NuxtLink
        >
      </div>
      <div>
        <NuxtLink to="/items/select" class="text-xl font-bold text-gray-500 mr-2"
          >Items</NuxtLink
        >
        <NuxtLink to="/items/insert" class="text-xl font-bold text-gray-500 mr-2"
          >Items Insert</NuxtLink
        >
        <NuxtLink to="/flights/select" class="text-xl font-bold text-gray-500 ml-2"
          >Flights</NuxtLink
        >
        <NuxtLink to="/flights/insert" class="text-xl font-bold text-gray-500 ml-2"
          >Flights insert</NuxtLink
        >
      </div>
      <div v-if="loggedIn" class="flex items-center space-x-6">
        <button
          @click="clear"
          class="px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <div v-else class="flex items-center space-x-4">
        <NuxtLink
          to="/login"
          class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
          Login
        </NuxtLink>
        <NuxtLink
          to="/signup"
          class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
          Signup
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const {loggedIn, user, session, clear} = useUserSession();
</script>
