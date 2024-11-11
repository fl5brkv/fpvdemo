import {sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const flights = sqliteTable('flights', {
  flightId: integer('flight_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  publicFlightId: text('public_flight_id').unique().notNull(),
  datetimeStart: text('datetime_start'),
  datetimeEnd: text('datetime_end'),
  location: text('location'),
  numberOfFlights: integer('number_of_flights', {mode: 'number'}),
  timeInAir: integer('time_in_air', {mode: 'number'}),
  purpose: text('purpose', {
    enum: [
      'recreational',
      'testing',
      'filming',
      'photography',
      'racing',
      'surveying',
      'inspection',
      'commercial delivery',
      'search and rescue',
      'agriculture',
      'mapping',
      'other',
    ],
  }),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const selectFlightSchema = createSelectSchema(flights).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  flightId: true,
  userId: true,
  publicFlightId: true,
  updatedAt: true,
  createdAt: true,
});

export const updateFlightSchema = createSelectSchema(flights).omit({
  publicFlightId: true,
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const deleteFlightSchema = createSelectSchema(flights).pick({
  flightId: true,
});
