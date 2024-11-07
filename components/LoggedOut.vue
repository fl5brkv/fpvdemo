<template>
  <div class="flex items-center space-x-4">
    <NuxtLink
      to="/login"
      class="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
      Login
    </NuxtLink>
    <span> or</span>
    <NuxtLink
      to="/signup"
      class="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600">
      Signup
    </NuxtLink>
  </div>
</template>

<script setup lang="ts"></script>
