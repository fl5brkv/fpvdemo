<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

    <button :disabled="isSubmitting || submitCount > 1" @click="onSubmit">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 1"> Verification email sent </span>
      <span v-else-if="response">{{ response }}</span>
      <span v-else> Submit </span>
    </button>
  </form>

  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {z} from 'zod';

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
    })
  ),
});

const [email, emailAttrs] = defineField('email');

const response = ref<string | null>(null);
const error = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await $fetch('/api/auth/email-verification-resend', {
      method: 'POST',
      body: values,
    });
    response.value = res;
    navigateTo('/email-verification')
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script>
