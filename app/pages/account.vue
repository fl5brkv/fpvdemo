<template>
  <AccountEmailChange />
  <div class="mb-10"></div>
  <AccountPasswordChange />
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
</script>
