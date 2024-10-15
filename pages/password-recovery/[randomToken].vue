<!-- not working -->

<template>
  {{ randomToken }}
  <div>
    <form @submit="onSubmit">
      <input
        type="password"
        v-model="plaintextPassword"
        v-bind="plaintextPasswordAttrs" />
      <div>{{ errors.plaintextPassword }}</div>

      <button :disabled="isSubmitting || submitCount > 1" @click="onSubmit">
        <span v-if="isSubmitting"> 🕒 Submitting... </span>
        <span v-else-if="submitCount > 1"> Recovery email sent </span>
        <span v-else> Submit </span>
      </button>
    </form>

    <span v-if="error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {z} from 'zod';

const route = useRoute();
const randomToken = route.params.randomToken;

const error = ref<string | null>(null);

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  initialValues: {randomToken},
  validationSchema: toTypedSchema(
    z.object({
      randomToken: z.string(),
      plaintextPassword: z.string().min(1),
    })
  ),
});

const [plaintextPassword, plaintextPasswordAttrs] =
  defineField('plaintextPassword');

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await $fetch('/api/auth/password-recovery', {
      method: 'POST',
      body: values,
    });
    navigateTo('/login');
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script>
