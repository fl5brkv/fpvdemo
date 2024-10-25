import {sha256} from 'ohash';

const validationSchema = z.object({
  email: z.string().email().toLowerCase(),
  plaintextPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email, plaintextPassword} = result.data;

  const selectedUser = await useDrizzle()
    .select({
      passwordSalt: tables.users.passwordSalt,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selectedUser)
    throw createError({
      statusMessage: 'Incorrect email or password.',
    });

  const hashedPassword = sha256(plaintextPassword + selectedUser.passwordSalt);

  const [validatedUserJoin] = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.hashedPassword, hashedPassword))
    .leftJoin(tables.profiles, eq(tables.users.userId, tables.profiles.userId));

  if (!validatedUserJoin)
    throw createError({
      statusMessage: 'Incorrect email or password.',
    });

  if (!validatedUserJoin.users.verifiedEmail)
    throw createError({
      statusMessage: 'Your email is not verified. Please verify your email.',
    });

  // await replaceUserSession(event, {
  //   user: {
  //     email: validatedUserJoin.users.email,
  //     username: validatedUserJoin.profiles?.username,
  //     country: validatedUserJoin.profiles?.country,
  //     currencyCode: validatedUserJoin.profiles?.currencyCode
  //   },
  // });

  await replaceUserSession(event, {
    user: {
      userId: validatedUserJoin.users.userId, // Match the structure defined in `auth.d.ts`
    },
  });

  return 'Login succesfull';
});
