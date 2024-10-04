<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.email" type="email" placeholder="Email" />
    <input
      v-model="form.plaintextPassword"
      type="password"
      placeholder="Password" />
    <button type="submit" :disabled="loading">Login</button>
  </form>
  <!-- Show error message if there is an error -->
  <!-- <p v-if="error">{{ error.statusMessage }}</p>
  <button @click="clearError">This will clear the error.</button> -->
</template>

<script setup lang="ts">
// Form data
const form = ref({
  email: '',
  plaintextPassword: '',
});

// Error and loading states
const error = ref(null);
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: form.value,
    });
  } catch (e: any) {
    console.error('ti jebe maženo' + e.statusCode)
  } finally {
    loading.value = false
  }
};
</script>
