import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const flightSessions = sqliteTable('flight_sessions', {
  flightSessionId: integer('flight_session_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  publicFlightSessionId: text('public_flight_session_id').unique().notNull(),
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

export const selectFlightSessionSchema = createSelectSchema(flightSessions);

export const insertFlightSessionSchema = createInsertSchema(
  flightSessions
).omit({
  flightSessionId: true,
  userId: true,
  publicFlightSessionId: true,
  updatedAt: true,
  createdAt: true,
});

export const updateFlightSessionSchema = createSelectSchema(
  flightSessions
).omit({
  publicFlightSessionId: true,
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const deleteFlightSessionSchema = createSelectSchema(
  flightSessions
).pick({
  flightSessionId: true,
});

// export const flightSessionsRelations = relations(
//   flightSessions,
//   ({one, many}) => ({
//     user: one(users, {
//       fields: [flightSessions.userId],
//       references: [users.userId],
//     }),
//     itemsToFlightSessions: many(itemsToFlightSessions),
//   })
// );
