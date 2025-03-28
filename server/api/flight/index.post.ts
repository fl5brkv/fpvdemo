import {flightInsertSchema} from '~~/server/database/schema/tables/flights';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    flightInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {
    user: {userId},
  } = await requireUserSession(event);

  const inserted = await useDrizzle()
    .insert(tables.flights)
    .values({
      ...result.data,
      userId,
    })
    .returning({flightId: tables.flights.flightId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'Failed to create flight',
    });

  return 'Your flight has been successfully added!';
});
