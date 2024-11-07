import type {z} from 'zod';
import type {
  insertItemSchema,
  selectItemSchema,
  updateItemSchema,
} from '~/server/database/schemas/tables/items';

export const useItem = async () => {
  const items = useState<z.infer<typeof selectItemSchema>[] | null>(
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

  const insertItem = async (values: z.infer<typeof insertItemSchema>) => {
    try {
      res.value = await $fetch('/api/item', {
        method: 'POST',
        body: values,
      });
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const updateItem = async (values: z.infer<typeof updateItemSchema>) => {
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
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      res.value = await $fetch('/api/item', {
        method: 'DELETE',
        body: {itemId},
      });
      items.value =
        items.value?.filter((item) => item.itemId !== itemId) || null;
    } catch (err: any) {
      error.value = err
        ? err.statusMessage
        : 'Oops! Something went wrong. Please try again later.';
    }
  };

  return {res, items, error, insertItem, updateItem, deleteItem};
};
