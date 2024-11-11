import {deleteFlightSchema} from '~/server/database/schemas/tables/flights';

const validationSchema = deleteFlightSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {flightId} = result.data;

  await requireUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.flights)
    .where(eq(tables.flights.flightId, flightId));

  if (!deleted)
    throw createError({
      statusMessage:
        'No flight were deleted. Flight not found.',
    });

  return 'Your flight has been successfully deleted!';
});
