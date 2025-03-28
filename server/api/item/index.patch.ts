import {itemUpdateSchema} from '~~/server/database/schema/tables/items';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    itemUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  await requireUserSession(event);

  const {itemId, ...item} = result.data;

  const updated = await useDrizzle()
    .update(tables.items)
    .set(item)
    .where(eq(tables.items.itemId, itemId));

  if (!updated)
    throw createError({
      statusMessage: 'No items were updated. Item not found.',
    });

  return 'Your item has been successfully updated!';
});
