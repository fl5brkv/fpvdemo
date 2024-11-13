<template>
  <header :class="childClass">
    <nav class="flex justify-between">
      <!-- Logo Section -->
      <div>
        <NuxtLink to="/"> 🚀 MyApp </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <button @click="open = !open" class="lg:hidden">
        <div v-if="!open">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            version="1.0"
            viewBox="0 0 75 75">
            <path
              fill="none"
              stroke="#333"
              stroke-linecap="round"
              stroke-width="10.25"
              d="M9.55 14.625h55.9M9.55 37.5h55.9M44.625 60.375h20.824" />
          </svg>
        </div>
        <div v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            version="1.0"
            viewBox="0 0 75 75">
            <path
              fill="none"
              stroke="#333"
              stroke-linecap="round"
              stroke-width="9.230590000000001"
              d="m16.465 58.707 42.242-42.246M16.29 16.293l42.245 42.246" />
          </svg>
        </div>
      </button>


        <TheHeaderMenu childClass="hidden lg:flex" />

    </nav>
    
      <TheHeaderMenu v-if="open" childClass="flex flex-col lg:hidden" />

  </header>
</template>

<script setup lang="ts">
defineProps<{
  childClass: string;
}>();

const open = ref(false);
</script>
