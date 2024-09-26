import {relations, sql} from 'drizzle-orm';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';
import {drones} from './drones';

export const fpvDrones = sqliteTable('fpv_drones', {
  fpvDroneId: integer('fpv_drone_id', {mode: 'number'}).primaryKey({
    autoIncrement: true,
  }),
  droneId: integer('drone_id')
    .references(() => drones.droneId, {
      onDelete: 'cascade',
    })
    .notNull(),
  customBuild: integer('custom_build', {mode: 'boolean'})
    .default(false)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(current_timestamp)`)
    .notNull(),
});

export const fpvDronesRelations = relations(fpvDrones, ({one}) => ({
  drone: one(drones, {
    fields: [fpvDrones.droneId],
    references: [drones.droneId],
  }),
}));
