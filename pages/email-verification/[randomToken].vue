<template>{{ randomToken}} {{ message }}</template>

<script setup lang="ts">
const route = useRoute();
const randomToken = route.params.randomToken;

const message = ref('');

onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/email-verification', {
      method: 'POST',
      body: {randomToken},
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
});
</script>
