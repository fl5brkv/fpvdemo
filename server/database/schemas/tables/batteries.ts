import {relations, sql} from 'drizzle-orm';
import {integer, real, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import { items } from './items';


export const batteries = sqliteTable('batteries', {
  batteryId: integer('battery_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  itemId: integer('item_id')
    .references(() => items.itemId, {onDelete: 'cascade'})
    .notNull(),
  chargeCycles: real('charge_cycles').default(0).notNull(),
  fullyChargedDays: real('fully_charged_days').default(0).notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const batteriesRelations = relations(batteries, ({one}) => ({
  item: one(items, {
    fields: [batteries.itemId],
    references: [items.itemId],
  }),
}));
