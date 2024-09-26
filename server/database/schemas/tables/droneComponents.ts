import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {items} from './items';
import {drones} from './drones';

export const droneComponents = sqliteTable('drone_components', {
  droneComponentId: integer('drone_component_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  itemId: integer('item_id')
    .references(() => items.itemId, {onDelete: 'cascade'})
    .notNull(),
  droneId: integer('drone_id').references(() => drones.droneId, {
    onDelete: 'set null',
  }),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const droneComponentsRelations = relations(droneComponents, ({one}) => ({
  item: one(items, {
    fields: [droneComponents.itemId],
    references: [items.itemId],
  }),
  drone: one(drones, {
    fields: [droneComponents.droneId],
    references: [drones.droneId],
  }),
}));
