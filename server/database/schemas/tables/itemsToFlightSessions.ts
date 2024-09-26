import {integer, primaryKey, sqliteTable} from 'drizzle-orm/sqlite-core';
import {relations} from 'drizzle-orm';
import {items} from './items';
import {flightSessions} from './flightSessions';

export const itemsToFlightSessions = sqliteTable(
  'items_to_flight_sessions',
  {
    itemId: integer('item_id')
      .references(() => items.itemId, {onDelete: 'cascade'})
      .notNull(),
    flightSessionId: integer('flight_session_id')
      .references(() => flightSessions.flightSessionId, {onDelete: 'cascade'})
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({columns: [t.itemId, t.flightSessionId]}),
  })
);

export const itemsToFlightSessionsRelations = relations(
  itemsToFlightSessions,
  ({one}) => ({
    item: one(items, {
      fields: [itemsToFlightSessions.itemId],
      references: [items.itemId],
    }),
    flightSession: one(flightSessions, {
      fields: [itemsToFlightSessions.flightSessionId],
      references: [flightSessions.flightSessionId],
    }),
  })
);
