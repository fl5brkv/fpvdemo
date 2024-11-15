import vue from '@vitejs/plugin-vue';

export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxtjs/turnstile',
    'nuxt-nodemailer',
    '@nuxt/fonts',
  ],
  hub: {
    database: true,
  },
  turnstile: {
    siteKey: '<your-site-key>',
  },
  runtimeConfig: {
   passwordSalt: 'password-salt'
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
    experimental: {
      tasks: true,
    },
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
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: {enabled: true},
});
