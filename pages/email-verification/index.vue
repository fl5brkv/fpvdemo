<template>
  <div>email has been sent to your email</div>
  <NuxtLink to="/">go home</NuxtLink>
</template>

<!-- <template>
  <div>email has been sent to your email</div>
  <div>
    if your email hasnt come or is invalid after 1 hour, resend the email ⬇️
  </div>
  <button :disabled="isSubmitting || submitCount > 1" @click="onSubmit">
    <span v-if="isSubmitting"> 🕒 Submitting... </span>
    <span v-else-if="submitCount > 1"> Verification email sent </span>
    <span v-else-if="response">{{ response }}</span>
    <span v-else> Submit </span>
  </button>

  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';

const {handleSubmit, isSubmitting, submitCount} = useForm();

const response = ref<string | null>(null);
const error = ref<string | null>(null);

const onSubmit = handleSubmit(async () => {
  try {
    const res = await $fetch('/api/auth/email-verification-resend', {
      method: 'POST',
      body: {email: 'fylydix@mailinator.com'},
    });
    response.value = res;
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script> -->
