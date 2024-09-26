import {relations} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {users} from './users';

export const recoveryTokens = sqliteTable('recovery_tokens', {
  recoveryTokenId: integer('recovery_token_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  hashedToken: text('hashed_token').unique().notNull(),
  expiresAt: integer('expires_at', {mode: 'number'}).notNull(),
});

export const recoveryTokensRelations = relations(recoveryTokens, ({one}) => ({
  user: one(users, {
    fields: [recoveryTokens.userId],
    references: [users.userId],
  }),
}));
