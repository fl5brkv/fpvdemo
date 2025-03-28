<template>
  <footer :class="childClass">
    <p>&copy; 2024 MyApp. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  childClass: string;
}>();
</script>
