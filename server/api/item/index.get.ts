export default eventHandler(async (event) => {
  // const {
  //   user: {userId},
  // } = await requireUserSession(event);
  const userId = 1;

  const selected = await useDrizzle()
    .select()
    .from(tables.items)
    .where(eq(tables.items.userId, userId));

  if (!selected)
    throw createError({
      statusMessage: 'No items were retrieved.',
    });

  return selected;
});
