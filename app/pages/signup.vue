<template>
  <div
    class="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h2>

    <form @submit.prevent="onSubmit">
      <!-- Email Field -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          id="email"
          type="email"
          v-model="email"
          v-bind="emailAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <div v-if="errors.email" class="text-sm text-red-500 mt-2">
          {{ errors.email }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="mb-6">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          v-bind="passwordAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <div v-if="errors.password" class="text-sm text-red-500 mt-2">
          {{ errors.password }}
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
          <span v-if="isSubmitting"> 🕒 Submitting...</span>
          <span v-else> Submit </span>
        </button>
      </div>
    </form>

    <!-- Feedback -->
    <div v-if="error" class="text-sm text-red-500 mt-4">{{ error }}</div>
    <div v-if="res" class="text-sm text-green-500 mt-4">{{ res }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});

import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {signupSchema} from '~~/server/database/schema/tables/users';

const {res, error, signup} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(signupSchema),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  await signup(values);
});
</script>
