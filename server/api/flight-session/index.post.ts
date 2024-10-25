import {customAlphabet} from 'nanoid/non-secure';

const validationSchema = z.object({
  datetimeStart: z.string().optional(),
  datetimeEnd: z.string().optional(),
  location: z.string().optional(),
  lat: z.number().int().optional(),
  lng: z.number().int().optional(),
  numberOfFlights: z.number().int(),
  timeInAir: z.number().int().optional(),
  purpose: z
    .enum([
      'recreational',
      'testing',
      'filming',
      'photography',
      'racing',
      'surveying',
      'inspection',
      'commercial delivery',
      'search and rescue',
      'agriculture',
      'mapping',
      'other',
    ])
    .optional(),
  additionalInfo: z.string().optional(),
  itemIds: z.array(z.number().int()).optional(),
});

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
    .onConflictDoNothing()
    .returning({flightSessionId: tables.flightSessions.flightSessionId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'Failed to create flight session',
    });

  const flightSessionId = inserted.flightSessionId;

  const itemIds = result.data.itemIds?.map((itemId) => ({
    itemId: itemId,
    flightSessionId: flightSessionId,
  }));

  if (itemIds) {
    await useDrizzle()
      .insert(tables.itemsToFlightSessions)
      .values(itemIds)
      .onConflictDoNothing();
  }

  

  return 'Inserted flight session/s and linked items successfully!';
});

// import {customAlphabet} from 'nanoid/non-secure';

// const flightSessionRowSchema = z.object({
//   datetimeStart: z.string().optional(),
//   datetimeEnd: z.string().optional(),
//   location: z.string().optional(),
//   lat: z.number().int().optional(),
//   lng: z.number().int().optional(),
//   numberOfFlights: z.number().int(),
//   timeInAir: z.number().int().optional(),
//   purpose: z
//     .enum([
//       'recreational',
//       'testing',
//       'filming',
//       'photography',
//       'racing',
//       'surveying',
//       'inspection',
//       'commercial delivery',
//       'search and rescue',
//       'agriculture',
//       'mapping',
//       'other',
//     ])
//     .optional(),
//   additionalInfo: z.string().optional(),
// });

// const validationSchema = z.object({
//   flightSessionRow: z.array(flightSessionRowSchema),
//   droneId: z.array(z.number().int().positive()),
// });

// export default eventHandler(async (event) => {
//   const result = await readValidatedBody(event, (body) =>
//     validationSchema.safeParse(body)
//   );

//   if (!result.success)
//     throw createError({statusMessage: 'The provided data is invalid'});

//   const {flightSessionRow, droneId} = result.data;

//   const {user} = await requireUserSession(event);

//   const userId = user.userId;

//   const alphabet = '346789abcdefghijkmnpqrtwxyz';

//   const nanoid = customAlphabet(alphabet, 21);

//   const insertedFlightSessions = await useDrizzle()
//     .insert(tables.flightSessions)
//     .values(
//       flightSessionRow.map((flightSession) => ({
//         ...flightSession,
//         userId,
//         publicFlightSessionId: nanoid(),
//       }))
//     )
//     .onConflictDoNothing()
//     .returning({flighSessionId: tables.flightSessions.flightSessionId});

//   if (!insertedFlightSessions)
//     throw createError({
//       statusMessage: 'Failed to create flight session/s',
//     });

//   return 'Inserted flight session/s!';
// });
