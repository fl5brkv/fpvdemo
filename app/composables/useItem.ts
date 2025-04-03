import type {z} from 'zod';
import type {
  itemDeleteSchema,
  itemInsertSchema,
  itemSelectSchema,
  itemUpdateSchema,
} from '~~/server/database/schema/tables/items';

export const useItem = async () => {
  const items = useState<z.infer<typeof itemSelectSchema>[] | null>(
    'items',
    () => null
  );

  const res = ref<string | null>(null);

  const error = ref<string | null>(null);

  await useFetch('/api/item', {
    onResponse({response}) {
      items.value = response._data;
    },
  });

  const insertItem = async (values: z.infer<typeof itemInsertSchema>) => {
    try {
      res.value = await $fetch('/api/item', {
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

  const updateItem = async (values: z.infer<typeof itemUpdateSchema>) => {
    try {
      res.value = await $fetch('/api/item', {
        method: 'PATCH',
        body: values,
      });
      items.value =
        items.value?.map((item) =>
          item.itemId === values.itemId ? {...item, ...values} : item
        ) || null;
    } catch (err: any) {
      error.value =
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.';
    }
  };

  const deleteItem = async (values: z.infer<typeof itemDeleteSchema>) => {
    try {
      res.value = await $fetch('/api/item', {
        method: 'DELETE',
        body: {values},
      });
      items.value =
        items.value?.filter((item) => item.itemId !== values.itemId) || null;
    } catch (err: any) {
      error.value =
        err.data?.message ||
        err.statusMessage ||
        'Oops! Something went wrong. Please try again later.';
    }
  };

  return {res, items, error, insertItem, updateItem, deleteItem};
};
