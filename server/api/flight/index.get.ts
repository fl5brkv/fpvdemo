export default eventHandler(async (event) => {
  const {
    user: {userId},
  } = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      flightId: tables.flights.flightId,
      flightName: tables.flights.flightName,
      date: tables.flights.date,
      location: tables.flights.location,
      landings: tables.flights.landings,
      timeInAir: tables.flights.timeInAir,
      additionalInfo: tables.flights.additionalInfo,
    })
    .from(tables.flights)
    .where(eq(tables.flights.userId, userId));

  return selected;
});
