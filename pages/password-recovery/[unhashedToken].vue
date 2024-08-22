<!-- here will be form with 2 inputs for password change  -->

<template>{{ unhashedToken }} {{ message }}</template>

<script setup lang="ts">
const route = useRoute();
const unhashedToken = route.params.unhashedToken;

const message = ref('');
const password = ref('')

// onMounted(async function submit() {
  try {
    const response = await $fetch('/api/auth/password-recovery', {
      method: 'post',
      body: {unhashedToken, password},
    });
    message.value = response; // Update reactive message
  } catch (error) {
    message.value = error;
  }
// });
</script>
