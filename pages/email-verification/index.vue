<template>
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

    <button :disabled="isSubmitting || submitCount > 1" @click="onSubmit">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 1"> Verification email sent </span>
      <span v-else> Submit </span>
    </button>
  </form>

  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {emailVerificationSchema} from '~/server/database/schemas/tables/users';
const {error, emailVerification} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(emailVerificationSchema),
});

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  emailVerification(values);
});
</script>
