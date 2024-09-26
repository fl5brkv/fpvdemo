import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {items} from './items';
import {droneComponents} from './droneComponents';

export const drones = sqliteTable('drones', {
  droneId: integer('drone_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  itemId: integer('item_id')
    .references(() => items.itemId, {onDelete: 'cascade'})
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const dronesRelations = relations(drones, ({one, many}) => ({
  item: one(items, {
    fields: [drones.itemId],
    references: [items.itemId],
  }),
  droneComponents: many(droneComponents),
}));
