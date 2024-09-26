import {relations} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {users} from './users';

export const verificationTokens = sqliteTable('verification_tokens', {
  verificationTokenId: integer('verification_token_id', {
    mode: 'number',
  }).primaryKey({autoIncrement: true}),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  hashedToken: text('hashed_token').unique().notNull(),
  expiresAt: integer('expires_at', {mode: 'number'}).notNull(),
});

export const verificationTokensRelations = relations(
  verificationTokens,
  ({one}) => ({
    user: one(users, {
      fields: [verificationTokens.userId],
      references: [users.userId],
    }),
  })
);
