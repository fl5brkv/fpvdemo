export default eventHandler(async (event) => {
  const {
    user: {userId},
  } = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      itemId: tables.items.itemId,
      itemName: tables.items.itemName,
      category: tables.items.category,
      status: tables.items.status,
      additionalInfo: tables.items.additionalInfo,
    })
    .from(tables.items)
    .where(eq(tables.items.userId, userId));

  return selected;
});
