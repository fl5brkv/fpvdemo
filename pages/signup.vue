<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

    <input
      type="password"
      v-model="plaintextPassword"
      v-bind="plaintextPasswordAttrs" />
    <div>{{ errors.plaintextPassword }}</div>

    <button :disabled="isSubmitting || submitCount > 5">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>
  </form>

  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {z} from 'zod';

const {
  handleSubmit,
  errors,
  defineField,
  isSubmitting,
  resetForm,
  submitCount,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      plaintextPassword: z.string().min(6),
    })
  ),
});

const error = ref<string | null>(null);

const [email, emailAttrs] = defineField('email');
const [plaintextPassword, plaintextPasswordAttrs] =
  defineField('plaintextPassword');

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: values,
    });
    navigateTo({path: '/email-verification'});
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
    resetForm();
  }
});
</script>
