export default eventHandler(async (event) => {
  const {
    user: {userId},
  } = await requireUserSession(event);

  await clearUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.users)
    .where(eq(tables.users.userId, userId));

  if (!deleted)
    throw createError({
      statusMessage: 'No account was deleted. Account not found.',
      data: {message: 'No account was deleted. Account not found.'},
    });

  return sendRedirect(event, '/login');
});
