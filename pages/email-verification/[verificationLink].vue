<template>
  <div
    class="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
    Verifying email
    <div v-if="error" class="text-center">
      <span class="block text-sm text-red-500 mb-4">{{ error }}</span>
      <NuxtLink
        to="/"
        class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Go home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});

const route = useRoute();

const {error, emailVerification} = await useUser();

onMounted(async () => {
  await emailVerification({
    verificationLink: Array.isArray(route.params.verificationLink)
      ? route.params.verificationLink[0]
      : route.params.verificationLink,
  });
});
</script>
