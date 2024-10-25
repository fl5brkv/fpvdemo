export default eventHandler(async (event) => {
  // const {
  //   user: {userId},
  // } = await requireUserSession(event);
  const userId = 1;

  const selected = await useDrizzle()
    .select()
    .from(tables.flightSessions)
    .where(eq(tables.flightSessions.userId, userId));

  if (!selected)
    throw createError({
      statusMessage: 'No flight sessions were retrieved.',
    });

  return selected;
});
