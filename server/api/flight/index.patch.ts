import {flightUpdateSchema} from '~~/server/database/schema/tables/flights';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    flightUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  await requireUserSession(event);

  const {flightId, ...flight} = result.data;

  const updated = await useDrizzle()
    .update(tables.flights)
    .set(flight)
    .where(eq(tables.flights.flightId, flightId));

  if (!updated)
    throw createError({
      statusMessage:
        'No flight was updated. Flight not found.',
      data: {
        message: 'No flight was updated. Flight not found.',
      },
    });

  return 'Your flight has been successfully updated!';
});
