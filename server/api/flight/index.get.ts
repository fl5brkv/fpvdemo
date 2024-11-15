export default eventHandler(async (event) => {
  const {
    user: {userId},
  } = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      flightId: tables.flights.flightId,
      flightName: tables.flights.flightName,
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

  return selected;
});
