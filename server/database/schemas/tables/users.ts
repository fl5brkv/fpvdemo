import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {verificationTokens} from './verificationTokens';
import {recoveryTokens} from './recoveryTokens';
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
  hashedPassword: text('hashed_password').notNull(),
  passwordSalt: text('password_salt').notNull(),
  username: text('username').unique(),
  country: text('country'),
  currencyCode: text('currency_code', {
    enum: [
      'USD',
      'EUR',
      'GBP',
      'GBP',
      'AUD',
      'CAD',
      'CNY',
      'NZD',
      'SGD',
      'ZAR',
      'BRL',
      'INR',
      'RUB',
      'JPY', // 0 DECIMAL
      'KRW', // 0 DECIMAL
      'BTC', // 8? DECIM?AL
      'ETH', // 18? DECIMAL
    ],
  })
    .default('USD')
    .notNull(),
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
  flightSessions: many(flightSessions),
  items: many(items),
}));
