<template>
  <AccountEmailChange />
  <AccountPasswordChange />
</template>

<script setup lang="ts">
definePageMeta({middleware: 'auth'});
</script>
