import type {z} from 'zod';
import type {
  emailChangeSchema,
  emailVerificationResendSchema,
  emailVerificationSchema,
  loginSchema,
  passwordChangeSchema,
  passwordRecoveryRequestSchema,
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
      navigateTo('/flights', {replace: true, external: true});
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const passwordRecoveryRequest = async (
    values: z.infer<typeof passwordRecoveryRequestSchema>
  ) => {
    try {
      res.value = await $fetch('/api/user/password-recovery/request', {
        method: 'POST',
        body: values,
      });
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
      await $fetch('/api/user/password-recovery', {
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

  const emailVerificationResend = async (
    values: z.infer<typeof emailVerificationResendSchema>
  ) => {
    try {
      res.value = await $fetch('/api/user/email-verification/resend', {
        method: 'POST',
        body: values,
      });
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
      await $fetch('/api/user/email-verification', {
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
    passwordRecoveryRequest,
    emailVerification,
    emailVerificationResend,
    emailChange,
    passwordChange,
  };
};
