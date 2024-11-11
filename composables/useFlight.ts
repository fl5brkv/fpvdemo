import type {z} from 'zod';
import type {
  insertFlightSchema,
  selectFlightSchema,
  updateFlightSchema,
} from '~/server/database/schemas/tables/flights';

export const useFlight = async () => {
  const flights = useState<z.infer<typeof selectFlightSchema>[] | null>(
    'flights',
    () => null
  );

  const res = ref<string | null>(null);

  const error = ref<string | null>(null);

  await useFetch('/api/flight', {
    onResponse({response}) {
      flights.value = response._data;
    },
  });

  const insertFlight = async (
    values: z.infer<typeof insertFlightSchema>
  ) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const updateFlight = async (
    values: z.infer<typeof updateFlightSchema>
  ) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'PATCH',
        body: values,
      });
      flights.value =
        flights.value?.map((flight) =>
          flight.flightId === values.flightId
            ? {...flight, ...values}
            : flight
        ) || null;
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const deleteFlight = async (flightId: number) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'DELETE',
        body: {flightId},
      });
      flights.value =
        flights.value?.filter(
          (flight) => flight.flightId !== flightId
        ) || null;
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  return {
    res,
    flights,
    error,
    insertFlight,
    updateFlight,
    deleteFlight,
  };
};
