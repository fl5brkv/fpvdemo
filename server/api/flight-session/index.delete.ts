const validationSchema = z.object({
  flightSessionId: z.number().int().positive(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) {
    throw createError({statusMessage: 'The provided data is invalid'});
  }

  const {flightSessionId} = result.data;

  await requireUserSession(event);

  const deletedFlightSession = await useDrizzle()
    .delete(tables.flightSessions)
    .where(eq(tables.flightSessions.flightSessionId, flightSessionId));

  if (!deletedFlightSession)
    throw createError({
      statusMessage:
        'No flight sessions were deleted. Flight session not found.',
    });

  return 'Delete successful';
});
