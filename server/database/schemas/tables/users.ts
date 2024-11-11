import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import * as z from 'zod';

export const users = sqliteTable('users', {
  userId: integer('user_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  email: text('email').unique().notNull(),
  verifiedEmail: integer('verified_email', {mode: 'boolean'})
    .default(false)
    .notNull(),
  password: text('password').notNull(),
  // passwordSalt: text('password_salt').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const signupSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const loginSchema = createSelectSchema(users).pick({
  email: true,
  password: true,
});

export const emailChangeSchema = createSelectSchema(users).pick({
  email: true,
});

export const emailVerificationSchema = createSelectSchema(users).pick({
  email: true,
});

export const emailVerificationRandomTokenSchema = z.object({
  randomToken: z.string(),
});

export const passwordChangeSchema = createSelectSchema(users)
  .pick({
    password: true,
  })
  .extend({
    newPassword: z.string(),
  });

export const passwordRecoverySchema = createSelectSchema(users).pick({
  email: true,
});

export const passwordRecoveryRandomTokenSchema = createSelectSchema(users)
  .pick({
    password: true,
  })
  .extend({
    randomToken: z.string(),
  });
