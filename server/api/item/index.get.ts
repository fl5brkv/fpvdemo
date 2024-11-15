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
      purchasePrice: tables.items.purchasePrice,
      purchaseDate: tables.items.purchaseDate,
      salePrice: tables.items.salePrice,
      saleDate: tables.items.saleDate,
      additionalInfo: tables.items.additionalInfo,
    })
    .from(tables.items)
    .where(eq(tables.items.userId, userId));

  return selected;
});
