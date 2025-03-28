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
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const itemSelectSchema = createSelectSchema(items).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const itemInsertSchema = createInsertSchema(items).omit({
  itemId: true,
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const itemUpdateSchema = createSelectSchema(items).omit({
  userId: true,
  updatedAt: true,
  createdAt: true,
});

export const itemDeleteSchema = createSelectSchema(items).pick({
  itemId: true,
});
