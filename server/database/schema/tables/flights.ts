import {sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';

export const flights = sqliteTable('flights', {
  flightId: integer('flight_id').primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  flightName: text('flight_name').notNull(),
  date: text('datetime_start'),
  location: text('location'),
  landings: integer('number_of_flights', {mode: 'number'}),
  timeInAir: integer('time_in_air', {mode: 'number'}),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const flightSelectSchema = createSelectSchema(flights).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const flightInsertSchema = createInsertSchema(flights).omit({
  flightId: true,
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const flightUpdateSchema = createSelectSchema(flights).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const flightDeleteSchema = createSelectSchema(flights).pick({
  flightId: true,
});
