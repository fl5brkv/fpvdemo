<template>
  <main :class="childClass"><slot /></main>
</template>

<script setup lang="ts">
defineProps<{
  childClass: string;
}>();
</script>
