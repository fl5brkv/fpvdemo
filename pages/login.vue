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

  <span v-if="error">
    <span
      v-if="error === 'Your email is not verified. Please verify your email.'">
      Your email is not verified.
      <NuxtLink to="email-verification/resend">resend</NuxtLink>
    </span>
    <span v-else>{{ error }}</span>
  </span>

  <div><NuxtLink to='/password-recovery/request'>zabudol som heslo</NuxtLink></div>
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
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: values,
    });
    navigateTo({path: '/'});
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script>
