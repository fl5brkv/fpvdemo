<template>
  update ur password
  <form @submit="onSubmit">
    <input type="password" v-model="password" v-bind="passwordAttrs" />
    <div>{{ errors.password }}</div>

    <input type="password" v-model="newPassword" v-bind="newPasswordAttrs" />
    <div>{{ errors.newPassword }}</div>

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
import {passwordChangeSchema} from '~/server/database/schemas/tables/users';

const {res, error, passwordChange} = await useUser();

const {handleSubmit, errors, defineField, isSubmitting, submitCount} = useForm({
  validationSchema: toTypedSchema(passwordChangeSchema),
});

const [password, passwordAttrs] = defineField('password');
const [newPassword, newPasswordAttrs] = defineField('newPassword');

const onSubmit = handleSubmit(async (values) => {
  await passwordChange(values);
});
</script>
