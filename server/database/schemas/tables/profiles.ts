import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {users} from './users';

export const profiles = sqliteTable('profiles', {
  profileId: integer('profile_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
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
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const profilesRelations = relations(profiles, ({one}) => ({
  user: one(users, {fields: [profiles.userId], references: [users.userId]}),
}));
