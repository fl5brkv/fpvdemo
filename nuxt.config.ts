import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxtjs/turnstile',
    'nuxt-nodemailer',
  ],
  hub: {
    database: true,
  },
  turnstile: {
    siteKey: '<your-site-key>',
  },
  runtimeConfig: {
    turnstile: {
      secretKey: '',
    },
  },
  nodemailer: {
    // from: '',
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
      user: '7c9df7466adb81',
      pass: 'b1f611da27f11d',
    },
  },
  nitro: {
    rollupConfig: {
      // @ts-ignore
      plugins: [vue()],
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['vee-validate'],
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
});
