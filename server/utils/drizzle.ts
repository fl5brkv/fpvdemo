import {drizzle} from 'drizzle-orm/d1';

import {schema} from '~~/server/database/schema/index';

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), {schema});
}

export { eq, and, gt } from 'drizzle-orm'
