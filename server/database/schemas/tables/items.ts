import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {itemsToFlightSessions} from './itemsToFlightSessions';

export const items = sqliteTable('items', {
  itemId: integer('item_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  userId: integer('user_id')
    .references(() => users.userId, {onDelete: 'cascade'})
    .notNull(),
  itemName: text('item_name').notNull(),
  category: text('category', {
    enum: [
      'goggles',
      'radio (TX)',
      'goggles', // contains video receiver (VRX)
      'action camera',
      'ND filters',
      'SD card',
      'SSD',
      'USB drive',
      'battery charger',
      'charger accessories',
      'LiPo bag',
      'toolkit',
      'game',
      'drone',
      'battery',
      'frame',
      'motors',
      'props',
      'FC',
      'ESC',
      'AIO (FC + ESC)',
      'GPS',
      'receiver (RX)',
      'transmitter (VTX)',
      'other',
    ],
  }).notNull(),
  status: text('status', {
    enum: ['new', 'active', 'inactive', 'damaged', 'sold', 'discarded'],
  }),
  purchasePrice: integer('purchase_price'),
  purchaseDate: text('purchase_date'),
  salePrice: integer('sale_price'),
  saleDate: text('sale_date'),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const itemsRelations = relations(items, ({one, many}) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.userId],
  }),
  itemsToFlightSessions: many(itemsToFlightSessions),
}));
