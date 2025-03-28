<template>
  <ul :class="childClass">
    <template v-if="loggedIn">
      <li>
        <NuxtLink
          to="/flights"
          class="text-lg text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300">
          Flights
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/items"
          class="text-lg text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300">
          Items
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/account"
          class="text-lg text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300">
          Account
        </NuxtLink>
      </li>
      <li>
        <button
          @click="logOut()"
          class="text-lg text-gray-700 hover:text-red-600 font-semibold transition-all duration-300">
          Logout
        </button>
      </li>
    </template>

    <template v-else>
      <li>
        <NuxtLink
          to="/login"
          class="text-lg text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300">
          Login
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/signup"
          class="text-lg text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300">
          Signup
        </NuxtLink>
      </li>
    </template>
  </ul>
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
