import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {verificationTokens} from './verificationTokens';
import {recoveryTokens} from './recoveryTokens';
import {flightSessions} from './flightSessions';
import {items} from './items';
import {profiles} from './profiles';

export const users = sqliteTable('users', {
  userId: integer('user_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  email: text('email').unique().notNull(),
  verifiedEmail: integer('verified_email', {mode: 'boolean'})
    .default(false)
    .notNull(),
  hashedPassword: text('hashed_password').notNull(),
  passwordSalt: text('password_salt').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const usersRelations = relations(users, ({one, many}) => ({
  verificationTokens: many(verificationTokens),
  recoveryTokens: many(recoveryTokens),
  flightSessions: many(flightSessions),
  items: many(items),
  profile: one(profiles),
}));
