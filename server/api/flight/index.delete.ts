import {flightDeleteSchema} from '~~/server/database/schema/tables/flights';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    flightDeleteSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {flightId} = result.data;

  await requireUserSession(event);

  const deleted = await useDrizzle()
    .delete(tables.flights)
    .where(eq(tables.flights.flightId, flightId));

  if (!deleted)
    throw createError({
      statusMessage: 'No flight was deleted. Flight not found.',
      data: {message: 'No flight was deleted. Flight not found.'},
    });

  return 'Your flight has been successfully deleted!';
});
