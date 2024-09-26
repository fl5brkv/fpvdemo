import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {verificationTokens} from './verificationTokens';
import {recoveryTokens} from './recoveryTokens';
import {profiles} from './profiles';
import {flightSessions} from './flightSessions';
import {items} from './items';

export const users = sqliteTable('users', {
  userId: integer('user_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  email: text('email').unique().notNull(),
  verifiedEmail: integer('verified_email', {mode: 'boolean'})
    .default(false)
    .notNull(),
  passwordHash: text('password_hash').notNull(),
  passwordSalt: text('password_salt').notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const usersRelations = relations(users, ({one, many}) => ({
  verificationTokens: many(verificationTokens),
  recoveryTokens: many(recoveryTokens),
  profile: one(profiles),
  flightSessions: many(flightSessions),
  items: many(items),
  //   tags: many(tags),
}));
