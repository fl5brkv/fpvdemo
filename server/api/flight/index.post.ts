import {customAlphabet} from 'nanoid/non-secure';
import {insertFlightSchema} from '~/server/database/schemas/tables/flights';

const validationSchema = insertFlightSchema;

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
    .insert(tables.flights)
    .values({
      ...result.data,
      userId,
      publicFlightId: nanoid(),
    })
    .returning({flightId: tables.flights.flightId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'Failed to create flight',
    });

  return 'Your flight has been successfully added!';
});
