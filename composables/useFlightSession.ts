import type {z} from 'zod';
import type {
  insertFlightSessionSchema,
  selectFlightSessionSchema,
  updateFlightSessionSchema,
} from '~/server/database/schemas/tables/flightSessions';

export const useFlightSession = async () => {
  const flightSessions = useState<
    z.infer<typeof selectFlightSessionSchema>[] | null
  >('flightSessions', () => null);

  const res = ref<string | null>(null);

  const error = ref<string | null>(null);

  await useFetch('/api/flight-session', {
    onResponse({response}) {
      flightSessions.value = response._data;
    },
  });

  const insertFlightSession = async (
    values: z.infer<typeof insertFlightSessionSchema>
  ) => {
    try {
      res.value = await $fetch('/api/flight-session', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const updateFlightSession = async (
    values: z.infer<typeof updateFlightSessionSchema>
  ) => {
    try {
      res.value = await $fetch('/api/flight-session', {
        method: 'PATCH',
        body: values,
      });
      flightSessions.value =
        flightSessions.value?.map((flightSession) =>
          flightSession.flightSessionId === values.flightSessionId
            ? {...flightSession, ...values}
            : flightSession
        ) || null;
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const deleteFlightSession = async (flightSessionId: number) => {
    try {
      res.value = await $fetch('/api/flight-session', {
        method: 'DELETE',
        body: {flightSessionId},
      });
      flightSessions.value =
        flightSessions.value?.filter(
          (flightSession) => flightSession.flightSessionId !== flightSessionId
        ) || null;
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  return {
    res,
    flightSessions,
    error,
    insertFlightSession,
    updateFlightSession,
    deleteFlightSession,
  };
};
