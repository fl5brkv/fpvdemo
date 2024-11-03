import {customAlphabet} from 'nanoid/non-secure';
import {insertFlightSessionSchema} from '~/server/database/schemas/tables/flightSessions';

const validationSchema = insertFlightSessionSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  // const {
  //   user: {userId},
  // } = await requireUserSession(event);

  const userId = 1;

  const alphabet = '346789abcdefghijkmnpqrtwxyz';

  const nanoid = customAlphabet(alphabet, 21);

  const inserted = await useDrizzle()
    .insert(tables.flightSessions)
    .values({
      ...result.data,
      userId,
      publicFlightSessionId: nanoid(),
    })
    .returning({flightSessionId: tables.flightSessions.flightSessionId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'Failed to create flight session',
    });

  return 'Inserted flight session/s and linked items successfully!';
});
