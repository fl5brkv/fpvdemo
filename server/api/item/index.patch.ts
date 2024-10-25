const category = [
  'goggles',
  'radio (TX)',
  'goggles', // contains video receiver (VRX)
  'action camera',
  'ND filters',
  'SD card',
  'SSD',
  'USB drive',
  'battery charger',
  'charger accessories',
  'LiPo bag',
  'toolkit',
  'game',
  'drone',
  'battery',
  'frame',
  'motors',
  'props',
  'FC',
  'ESC',
  'AIO (FC + ESC)',
  'GPS',
  'receiver (RX)',
  'transmitter (VTX)',
  'other',
] as const;

const status = [
  'new',
  'active',
  'inactive',
  'damaged',
  'sold',
  'discarded',
] as const;

const validationSchema = z.object({
  itemId: z.number().int(),
  itemName: z.string().min(1),
  categories: z.enum(category),
  statuses: z.enum(status).optional(),
  purchasePrice: z.number().int().positive().optional(),
  purchaseDate: z.string().optional(),
  salePrice: z.number().int().positive().optional(),
  saleDate: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  await requireUserSession(event);

  const {itemId, ...item} = result.data;

  const updated = await useDrizzle()
    .update(tables.items)
    .set(item)
    .where(eq(tables.items.itemId, itemId));

  if (!updated)
    throw createError({
      statusMessage: 'No items were updated. Item not found.',
    });

  return 'Update successful';
});
