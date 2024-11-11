<template>
  update ur email
  <form @submit="onSubmit">
    <input type="email" v-model="email" v-bind="emailAttrs" />
    <div>{{ errors.email }}</div>

    <button :disabled="isSubmitting || submitCount > 5">
      <span v-if="isSubmitting"> 🕒 Submitting... </span>
      <span v-else-if="submitCount > 5"> ❌ Too many attempts </span>
      <span v-else> Submit </span>
    </button>
  </form>

  <span v-if="res">{{ res }}</span>
  <span v-if="error">{{ error }}</span>
</template>

<script setup lang="ts">
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {emailChangeSchema} from '~/server/database/schemas/tables/users';
const {user} = useUserSession();

const {res, error, emailChange} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(emailChangeSchema),
});

const [email, emailAttrs] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  await emailChange(values);
});
</script>
