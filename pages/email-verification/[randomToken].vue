<template>
  {{ randomToken }}
  <div v-if="error">
    <NuxtLink to="/">go home</NuxtLink>
    <span>{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});

const route = useRoute();
const randomToken = route.params.randomToken;
const {error, emailVerificationRandomToken} = await useUser();

onMounted(async () => {
  emailVerificationRandomToken({
    randomToken: Array.isArray(randomToken)
      ? randomToken.join(', ')
      : randomToken,
  });
});
</script>
