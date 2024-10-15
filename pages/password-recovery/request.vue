<!-- here will be form with 1 input for email  -->
<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

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

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
    })
  ),
});

const error = ref<string | null>(null);

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  try {
    await $fetch('/api/auth/password-recovery-request', {
      method: 'POST',
      body: values,
    });
    navigateTo({path: '/password-recovery'});
  } catch (err: any) {
    error.value = err
      ? err.statusMessage
      : 'Oops! Something went wrong. Please try again later.';
  }
});
</script>
