import {insertItemSchema} from '~/server/database/schemas/tables/items';

const validationSchema = insertItemSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );
  
  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  // const {
  //   user: {userId},
  // } = await requireUserSession(event);

  const userId = 1;

  const inserted = await useDrizzle()
    .insert(tables.items)
    .values({...result.data, userId})
    .returning({id: tables.items.itemId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'The data is invalid.',
    });

  return 'item inserted succesfully';
});
