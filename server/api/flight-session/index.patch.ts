import {updateFlightSessionSchema} from '~/server/database/schemas/tables/flightSessions';

const validationSchema = updateFlightSessionSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  // await requireUserSession(event);

  const {flightSessionId, ...flightSession} = result.data;

  const updated = await useDrizzle()
    .update(tables.flightSessions)
    .set(flightSession)
    .where(eq(tables.flightSessions.flightSessionId, flightSessionId));

  if (!updated)
    throw createError({
      statusMessage:
        'No flight sessions were updated. Flight session not found.',
    });

  return 'Your flight session has been successfully updated!';
});
