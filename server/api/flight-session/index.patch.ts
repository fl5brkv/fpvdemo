const flightSessionRowSchema = z.object({
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

const validationSchema = z.object({
  flightSessionId: z.number().int().positive(),
  flightSessionRow: flightSessionRowSchema,
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) {
    throw createError({statusMessage: 'The provided data is invalid'});
  }

  const {flightSessionId, flightSessionRow} = result.data;
  const {itemIds = []} = flightSessionRow;

  await requireUserSession(event);

  const updatedFlightSession = await useDrizzle()
    .update(tables.flightSessions)
    .set(flightSessionRow)
    .where(eq(tables.flightSessions.flightSessionId, flightSessionId))
    .returning({flightSessionId: tables.flightSessions.flightSessionId});

  if (!updatedFlightSession) {
    throw createError({
      statusMessage: 'No flight session was updated. Flight session not found.',
    });
  }

  if (itemIds.length > 0) {
    await useDrizzle()
      .delete(tables.itemsToFlightSessions)
      .where(eq(tables.itemsToFlightSessions.flightSessionId, flightSessionId));

    const flightSessionItemsData = itemIds.map((itemId) => ({
      flightSessionId,
      itemId,
    }));

    await useDrizzle()
      .insert(tables.itemsToFlightSessions)
      .values(flightSessionItemsData)
      .onConflictDoNothing();
  }

  return 'Flight session and associated items updated successfully!';
});

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
//   flightSessionId: z.number().int().positive(),
//   flightSessionRow: flightSessionRowSchema,
// });

// export default eventHandler(async (event) => {
//   const result = await readValidatedBody(event, (body) =>
//     validationSchema.safeParse(body)
//   );

//   if (!result.success) {
//     throw createError({statusMessage: 'The provided data is invalid'});
//   }

//   const {flightSessionId, flightSessionRow} = result.data;

//   await requireUserSession(event);

//   const updatedItem = await useDrizzle()
//     .update(tables.flightSessions)
//     .set(flightSessionRow)
//     .where(eq(tables.flightSessions.flightSessionId, flightSessionId));

//   if (!updatedItem) {
//     throw createError({
//       statusMessage: 'No items were updated. Item not found.',
//     });
//   }

//   return 'Update successful';
// });
