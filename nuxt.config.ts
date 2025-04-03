import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxthub/core', 'nuxt-auth-utils'],

  hub: {
    database: true,
  },

  runtimeConfig: {
    passwordSalt: import.meta.env.NUXT_PASSWORD_SALT,
    mailerHost: import.meta.env.NUXT_MAILER_HOST,
    mailerPort: import.meta.env.NUXT_MAILER_PORT,
    mailerUsername: import.meta.env.NUXT_MAILER_USERNAME,
    mailerPassword: import.meta.env.NUXT_MAILER_PASSWORD,
    mailerAuthType: import.meta.env.NUXT_MAILER_AUTHTYPE,
    public: {
      baseURL: 'http://localhost:3000',
    },
  },

  $production: {
    runtimeConfig: {
      public: {
        baseURL: 'https://fpvdemo.fun',
      },
    },
  },

  $development: {
    runtimeConfig: {
      public: {
        baseURL: 'http://localhost:3000',
      },
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

  css: ['~/assets/css/main.css'],

  vite: {
    build: {
      rollupOptions: {
        external: ['worker-mailer'], // ✅ Prevents client-side bundling
      },
    },
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
