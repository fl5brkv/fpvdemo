export default eventHandler(async (event) => {
  const {
    user: {userId},
  } = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      flightId: tables.flights.flightId,
      publicFlightId: tables.flights.publicFlightId,
      datetimeStart: tables.flights.datetimeStart,
      datetimeEnd: tables.flights.datetimeEnd,
      location: tables.flights.location,
      numberOfFlights: tables.flights.numberOfFlights,
      timeInAir: tables.flights.timeInAir,
      purpose: tables.flights.purpose,
      additionalInfo: tables.flights.additionalInfo,
    })
    .from(tables.flights)
    .where(eq(tables.flights.userId, userId));

  if (!selected)
    throw createError({
      statusMessage: 'No flights were retrieved.',
    });

  return selected;
});
