<template>
  <div
    class="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
      Update Your Password
    </h2>

    <!-- Password Change Form -->
    <form @submit.prevent="onSubmit">
      <!-- Current Password -->
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Current Password</label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          v-bind="passwordAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your current password" />
        <div v-if="errors.password" class="text-sm text-red-500 mt-2">
          {{ errors.password }}
        </div>
      </div>

      <!-- New Password -->
      <div class="mb-4">
        <label for="newPassword" class="block text-sm font-medium text-gray-700"
          >New Password</label
        >
        <input
          id="newPassword"
          type="password"
          v-model="newPassword"
          v-bind="newPasswordAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your new password" />
        <div v-if="errors.newPassword" class="text-sm text-red-500 mt-2">
          {{ errors.newPassword }}
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

    <!-- Feedback Messages -->
    <div v-if="error" class="text-sm text-red-500 mt-4">
      <span>{{ error }}</span>
    </div>

    <div v-if="res" class="text-sm text-green-500 mt-4">{{ res }}</div>
  </div>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {passwordChangeSchema} from '~/server/database/schemas/tables/users';

const {res, error, passwordChange} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(passwordChangeSchema),
});

const [password, passwordAttrs] = defineField('password');
const [newPassword, newPasswordAttrs] = defineField('newPassword');

const onSubmit = handleSubmit(async (values) => {
  await passwordChange(values);
});
</script>
