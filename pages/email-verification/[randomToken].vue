<template>
  {{ randomToken }}
  <div v-if="error">
    <NuxtLink to="/">go home</NuxtLink>
    <span>{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const randomToken = route.params.randomToken;

const response = ref<string | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await $fetch('/api/auth/email-verification', {
      method: 'POST',
      body: {randomToken},
    });
    navigateTo({path: '/login'});
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script>
