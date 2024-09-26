import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {users} from './users';
import {itemsToFlightSessions} from './itemsToFlightSessions';
import {batteries} from './batteries';
import {drones} from './drones';
import {droneComponents} from './droneComponents';

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
      // general items
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
      'other',
      // drones table
      'fpv drone',
      'other drone',
      // batteries table
      'battery',
      // drone components table
      'frame',
      'motors',
      'props',
      'FC',
      'ESC',
      'AIO (FC + ESC)',
      'GPS',
      'receiver (RX)',
      'transmitter (VTX)',
      'other component',
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
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const itemsRelations = relations(items, ({one, many}) => ({
  user: one(users, {
    fields: [items.userId],
    references: [users.userId],
  }),
  itemsToFlightSessions: many(itemsToFlightSessions),
  batteries: many(batteries),
  drones: many(drones),
  droneComponents: many(droneComponents),
  // droneComponents: many(droneComponents),
}));
