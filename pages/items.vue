<template>
  <ItemSelect v-if="loggedIn" />
  <LoggedOut v-else />
</template>

<script setup lang="ts">
const {loggedIn} = useUserSession();
</script>
