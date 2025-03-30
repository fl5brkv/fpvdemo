import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-auth-utils'],
  hub: {
    database: true,
  },
  runtimeConfig: {
    passwordSalt: 'password-salt',
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
