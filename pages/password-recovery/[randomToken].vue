<template>
  <div>
    <form @submit="onSubmit">
      <input type="password" v-model="password" v-bind="passwordAttrs" />
      <div>{{ errors.password }}</div>

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
import {passwordRecoveryRandomTokenSchema} from '~/server/database/schemas/tables/users';
const {error, passwordRecoveryRandomToken} = await useUser();

const route = useRoute();

const {handleSubmit, errors, defineField, isSubmitting, submitCount, setFieldValue} = useForm(
  {
    validationSchema: toTypedSchema(passwordRecoveryRandomTokenSchema),
  }
);

setFieldValue('randomToken', route.params.randomToken[0])

const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  passwordRecoveryRandomToken(values);
});
</script>
