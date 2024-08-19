// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxthub/core', "nuxt-auth-utils"],
  hub: {
    database: true,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});