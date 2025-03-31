import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-auth-utils'],
  hub: {
    database: true,
  },
  runtimeConfig: {
    passwordSalt: 'password-salt',
    mailerHost: import.meta.env.NUXT_MAILER_HOST,
    mailerPort: import.meta.env.NUXT_MAILER_PORT,
    mailerUsername: import.meta.env.NUXT_MAILER_USERNAME,
    mailerPassword: import.meta.env.NUXT_MAILER_PASSWORD,
    mailerAuthType: import.meta.env.NUXT_MAILER_AUTHTYPE,
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
  css: ['~/assets/css/main.css'],
  vite: {
    optimizeDeps: {
      exclude: ['vee-validate'],
    },
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2024-04-03',
  devtools: {enabled: false},
  future: {
    compatibilityVersion: 4,
  },
  routeRules: {
    '/': {redirect: '/flights'},
  },
});
