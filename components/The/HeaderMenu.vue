<template>
  <div :class="childClass">
    <NuxtLink to="/flights"> flights </NuxtLink>
    <NuxtLink to="/items"> Items </NuxtLink>

    <!-- Auth Section -->

    <div v-if="loggedIn">
      <button @click="logOut()">Logout</button>
    </div>
    <div v-else>
      <NuxtLink to="/login"> Login </NuxtLink>
      <NuxtLink to="/signup"> Signup </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const {loggedIn, clear} = useUserSession();

const logOut = () => {
  clear();
  navigateTo('/login', {replace: true, external: true});
};

defineProps<{
  childClass: string;
}>();
</script>
