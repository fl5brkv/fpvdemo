// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-auth-utils', '@nuxtjs/turnstile'],
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
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
