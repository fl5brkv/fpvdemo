import {deleteFlightSessionSchema} from '~/server/database/schemas/tables/flightSessions';

const validationSchema = deleteFlightSessionSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) {
    throw createError({statusMessage: 'The provided data is invalid'});
  }

  const {flightSessionId} = result.data;

  // await requireUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.flightSessions)
    .where(eq(tables.flightSessions.flightSessionId, flightSessionId));

  if (!deleted)
    throw createError({
      statusMessage: 'No items were deleted. Item not found.',
    });

  return 'Your flight sessionhas been successfully deleted!';
});
