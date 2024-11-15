<template>
  <div
    class="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Password Reset</h2>

    <form @submit.prevent="onSubmit">
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >New Password</label
        >
        <input
          id="password"
          type="password"
          v-model="password"
          v-bind="passwordAttrs"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your new password" />
        <div v-if="errors.password" class="text-sm text-red-500 mt-2">
          {{ errors.password }}
        </div>
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          :disabled="isSubmitting || submitCount > 1"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300">
          <span v-if="isSubmitting"> 🕒 Submitting...</span>
          <span v-else-if="submitCount > 1"> Recovery email sent </span>
          <span v-else> Submit </span>
        </button>
      </div>
    </form>

    <div v-if="error" class="text-sm text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({middleware: 'guest'});

import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {passwordRecoverySchema} from '~/server/database/schemas/tables/users';
const {error, passwordRecovery} = await useUser();

const route = useRoute();

const {
  handleSubmit,
  errors,
  defineField,
  isSubmitting,
  submitCount,
  setFieldValue,
} = useForm({
  validationSchema: toTypedSchema(passwordRecoverySchema),
});

setFieldValue(
  'recoveryLink',
  Array.isArray(route.params.recoveryLink)
    ? route.params.recoveryLink[0]
    : route.params.recoveryLink
);

const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  await passwordRecovery(values);
});
</script>
