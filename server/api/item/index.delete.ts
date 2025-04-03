import {itemDeleteSchema} from '~~/server/database/schema/tables/items';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    itemDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {itemId} = result.data;

  await requireUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.items)
    .where(eq(tables.items.itemId, itemId));

  if (!deleted)
    throw createError({
      statusMessage: 'No items were deleted. Item not found.',
      data: {message: 'No items were deleted. Item not found.'},
    });

  return 'Your item has been successfully deleted!';
});
