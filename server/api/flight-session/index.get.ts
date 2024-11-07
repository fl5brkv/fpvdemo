import {count} from 'drizzle-orm';

export default eventHandler(async (event) => {
  // const {
  //   user: {userId},
  // } = await requireUserSession(event);
  const userId = 1;

  const selected = await useDrizzle()
    .select({
      flightSessionId: tables.flightSessions.flightSessionId,
      publicFlightSessionId: tables.flightSessions.publicFlightSessionId,
      datetimeStart: tables.flightSessions.datetimeStart,
      datetimeEnd: tables.flightSessions.datetimeEnd,
      location: tables.flightSessions.location,
      numberOfFlights: tables.flightSessions.numberOfFlights,
      timeInAir: tables.flightSessions.timeInAir,
      purpose: tables.flightSessions.purpose,
      additionalInfo: tables.flightSessions.additionalInfo,
      count: count(),
    })
    .from(tables.flightSessions)
    .where(eq(tables.flightSessions.userId, userId));

  if (!selected)
    throw createError({
      statusMessage: 'No flight sessions were retrieved.',
    });

  return selected;
});
