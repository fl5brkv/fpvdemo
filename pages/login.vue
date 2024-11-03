<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    <div>{{ errors.password }}</div>

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

  <div>
    <NuxtLink to="/password-recovery/request">zabudol som heslo</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {loginSchema} from '~/server/database/schemas/tables/users';

const {error, login} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  login(values);
});
</script>
