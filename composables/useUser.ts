import type {z} from 'zod';
import type {
  emailChangeSchema,
  emailVerificationRandomTokenSchema,
  emailVerificationSchema,
  loginSchema,
  passwordChangeSchema,
  passwordRecoveryRandomTokenSchema,
  passwordRecoverySchema,
  signupSchema,
} from '~/server/database/schemas/tables/users';

export const useUser = async () => {
  const res = ref<string | null>(null);

  const error = ref<string | null>(null);

  const signup = async (values: z.infer<typeof signupSchema>) => {
    try {
      res.value = await $fetch('/api/user/signup', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const login = async (values: z.infer<typeof loginSchema>) => {
    try {
      await $fetch('/api/user/login', {
        method: 'POST',
        body: values,
      });
      navigateTo('/account', {replace: true, external: true});
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const passwordRecovery = async (
    values: z.infer<typeof passwordRecoverySchema>
  ) => {
    try {
      res.value = await $fetch('/api/user/password-recovery', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const passwordRecoveryRandomToken = async (
    values: z.infer<typeof passwordRecoveryRandomTokenSchema>
  ) => {
    try {
      await $fetch('/api/user/password-recovery/random-token', {
        method: 'POST',
        body: values,
      });
      navigateTo('/login');
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const emailVerification = async (
    values: z.infer<typeof emailVerificationSchema>
  ) => {
    try {
      res.value = await $fetch('/api/user/email-verification', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const emailVerificationRandomToken = async (
    values: z.infer<typeof emailVerificationRandomTokenSchema>
  ) => {
    try {
      await $fetch('/api/user/email-verification/random-token', {
        method: 'POST',
        body: values,
      });
      navigateTo('/login');
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const emailChange = async (values: z.infer<typeof emailChangeSchema>) => {
    try {
      res.value = await $fetch('/api/user/email-change', {
        method: 'PATCH',
        body: values,
      });
      navigateTo('/login');
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const passwordChange = async (
    values: z.infer<typeof passwordChangeSchema>
  ) => {
    try {
      res.value = await $fetch('/api/user/password-change', {
        method: 'PATCH',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  return {
    res,
    error,
    signup,
    login,
    passwordRecovery,
    passwordRecoveryRandomToken,
    emailVerification,
    emailVerificationRandomToken,
    emailChange,
    passwordChange,
  };
};
