<template>
  <div
    class="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Your Email</h2>

    <form @submit.prevent="onSubmit">
      <!-- Email Field -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >New Email</label
        >
        <input
          id="email"
          type="email"
          v-model="email"
          v-bind="emailAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your new email" />
        <div v-if="errors.email" class="text-sm text-red-500 mt-2">
          {{ errors.email }}
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center">
        <button
          type="submit"
          :disabled="isSubmitting || submitCount > 5"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
          <span v-if="isSubmitting"> 🕒 Submitting...</span>
          <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
          <span v-else> Submit </span>
        </button>
      </div>
    </form>

    <!-- Feedback -->
    <div v-if="error" class="text-sm text-red-500 mt-4">
      <span>{{ error }}</span>
    </div>

    <div v-if="res" class="text-sm text-green-500 mt-4">{{ res }}</div>
  </div>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {emailChangeSchema} from '~/server/database/schemas/tables/users';
const {user} = useUserSession();

const {res, error, emailChange} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(emailChangeSchema),
});

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  await emailChange(values);
});
</script>
