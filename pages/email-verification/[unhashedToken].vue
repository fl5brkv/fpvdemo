<template>{{ unhashedToken }} {{ message }}</template>

<script setup lang="ts">
const route = useRoute();
const unhashedToken = route.params.unhashedToken;

const message = ref('');

onMounted(async function submit() {
  try {
    const response = await $fetch('/api/auth/email-verification', {
      method: 'post',
      body: {unhashedToken},
    });
    message.value = response; // Update reactive message
  } catch (error) {
    message.value = error;
  }
});
</script>
