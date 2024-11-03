import {deleteItemSchema} from '~/server/database/schemas/tables/items';

const validationSchema = deleteItemSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {itemId} = result.data;
  
  // await requireUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.items)
    .where(eq(tables.items.itemId, itemId));

  if (!deleted)
    throw createError({
      statusMessage: 'No items were deleted. Item not found.',
    });

  return 'Delete successful';
});
