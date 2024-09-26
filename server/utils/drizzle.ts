import {drizzle} from 'drizzle-orm/d1';

import {schema} from '@/server/database/schemas/index';

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), {schema});
}

export type User = typeof schema.users.$inferSelect;
