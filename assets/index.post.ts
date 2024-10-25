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
  itemName: z.string().min(1),
  category: z.enum(category),
  status: z.enum(status).optional(),
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

  // const {
  //   user: {userId},
  // } = await requireUserSession(event);

  const userId = 1;

  const inserted = await useDrizzle()
    .insert(tables.items)
    .values({...result.data, userId})
    .returning({id: tables.items.itemId})
    .get()

  if (!inserted)
    throw createError({
      statusMessage: 'The data is invalid.',
    });

  return 'item inserted succesfully';
});
