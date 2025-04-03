import type {z} from 'zod';
import type {
  flightSelectSchema,
  flightInsertSchema,
  flightUpdateSchema,
  flightDeleteSchema,
} from '~~/server/database/schema/tables/flights';

export const useFlight = async () => {
  const flights = useState<z.infer<typeof flightSelectSchema>[] | null>(
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

  const insertFlight = async (values: z.infer<typeof flightInsertSchema>) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value =
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.';
    }
  };

  const updateFlight = async (values: z.infer<typeof flightUpdateSchema>) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'PATCH',
        body: values,
      });
      flights.value =
        flights.value?.map((flight) =>
          flight.flightId === values.flightId ? {...flight, ...values} : flight
        ) || null;
    } catch (err: any) {
      error.value =
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.';
    }
  };

  const deleteFlight = async (values: z.infer<typeof flightDeleteSchema>) => {
    try {
      res.value = await $fetch('/api/flight', {
        method: 'DELETE',
        body: {values},
      });
      flights.value =
        flights.value?.filter(
          (flight) => flight.flightId !== values.flightId
        ) || null;
    } catch (err: any) {
      error.value =
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.';
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
