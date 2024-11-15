import {sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

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

export const selectItemSchema = createSelectSchema(items).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const insertItemSchema = createInsertSchema(items, {
  itemName: (schema) => schema.itemName.min(1),
}).omit({
  itemId: true,
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const updateItemSchema = createSelectSchema(items, {
  itemName: (schema) => schema.itemName.min(1),
}).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const deleteItemSchema = createSelectSchema(items).pick({
  itemId: true,
});
