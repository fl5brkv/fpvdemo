import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schemas/tables', 
  out: './server/database/migrations',
});
