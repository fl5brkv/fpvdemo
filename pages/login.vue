<template>
  <form @submit.prevent="onSubmit">
    <input
      v-model="form.email"
      type="email"
      placeholder="Email"
      @blur="validate" />
    <div v-if="errors?.email" className="text-red-800">
      <span v-for="error in errors?.email?._errors"> {{ error }}</span>
    </div>

    <input
      v-model="form.plaintextPassword"
      type="password"
      placeholder="Password"
      @blur="validate" />
    <div v-if="errors?.plaintextPassword" className="text-red-800">
      <span v-for="error in errors?.plaintextPassword?._errors"> {{ error }}</span>
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<script setup lang="ts">
import * as z from 'zod';

const form = ref({
  email: '',
  plaintextPassword: '',
});

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  plaintextPassword: z.string().min(6),
});

type FormSchema = z.infer<typeof formSchema>;

const errors = ref<z.ZodFormattedError<FormSchema> | null>(null);

const validate = () => {
  const isValid = formSchema.safeParse(form.value);
  if (!isValid.success) {
    errors.value = isValid.error.format();
  } else {
    errors.value = null;
  }
};

const onSubmit = async () => {
  // if (loading.value) return;
  // loading.value = true;

  // // Validate both fields before submission
  // validateField('email');
  // validateField('plaintextPassword');

  // // Check for errors before making the request
  // if (errors.value.email || errors.value.plaintextPassword) {
  //   loading.value = false; // Stop loading if there are errors
  //   return;
  // }

  // try {
  //   await $fetch('/api/auth/login', {
  //     method: 'POST',
  //     body: form.value,
  //   });
  // } catch (err: any) {
  //   error.value = `Failed to login: ${err || 'Unknown error'}`;
  // } finally {
  //   loading.value = false;
  // }
};
</script>
