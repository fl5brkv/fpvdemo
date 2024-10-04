<!-- <template>
  <input v-model="email" v-bind="emailAttrs" type="text" />

  <pre>values: {{ values }}</pre>
  <pre>errors: {{ errors }}</pre>
</template>

<script setup lang="ts">
import {toTypedSchema} from '@vee-validate/zod';
import {useForm} from 'vee-validate';
import * as z from 'zod';

const {values, errors, defineField} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1, 'required'),
    })
  ),
});

const [email, emailAttrs] = defineField('email');
</script> -->

<template>
  <input v-model="email" v-bind="emailAttrs" />
  <div>{{ errors.email }}</div>

  <input v-model="password" v-bind="passwordAttrs" />
  <div>{{ errors.password }}</div>
</template>

<script setup>
import {useForm} from 'vee-validate';
import {toTypedSchema} from '@vee-validate/zod';
import {z} from 'zod';

const {errors, defineField} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.string().min(1).email(),
      password: z.string().min(6),
    })
  ),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
</script>
