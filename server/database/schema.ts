import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({autoIncrement: true}),
  email: text('email').unique().notNull(),
  verifiedEmail: integer('verified_email', {mode: 'boolean'}).default(false),
  password: text('password').notNull(),
  salt: text('salt').notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const usersRelations = relations(users, ({many}) => ({
  verificationTokens: many(verificationTokens),
}));

export const verificationTokens = sqliteTable('verificationTokens', {
  id: integer('id').primaryKey({autoIncrement: true}),
  userId: integer('user_id')
    .references(() => users.id, {onDelete: 'cascade'})
    .notNull(),
  hashedToken: text('hashed_token').unique().notNull(),
  expiresAt: integer('expires_at', {mode: 'number'}).notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const verificationTokensRelations = relations(
  verificationTokens,
  ({one}) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.id],
    }),
  })
);
