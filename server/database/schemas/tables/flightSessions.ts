import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {itemsToFlightSessions} from './itemsToFlightSessions';

export const flightSessions = sqliteTable('flight_sessions', {
  flightSessionId: integer('flight_session_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  datetimeStart: text('datetime_start'),
  datetimeEnd: text('datetime_end'),
  location: text('location'),
  lat: integer('lat'),
  lng: integer('lng'),
  numberOfFlights: integer('number_of_flights', {mode: 'number'})
    .default(1)
    .notNull(),
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
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const flightSessionsRelations = relations(
  flightSessions,
  ({one, many}) => ({
    user: one(users, {
      fields: [flightSessions.userId],
      references: [users.userId],
    }),
    itemsToFlightSessions: many(itemsToFlightSessions),
  })
);
