import {itemInsertSchema} from '~~/server/database/schema/tables/items';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    itemInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {
    user: {userId},
  } = await requireUserSession(event);

  const inserted = await useDrizzle()
    .insert(tables.items)
    .values({...result.data, userId})
    .returning({id: tables.items.itemId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'The data is invalid.',
      data: {message: 'The data is invalid.'},
    });

  return 'Your item has been successfully added!';
});
