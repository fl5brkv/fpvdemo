import {sha256} from 'ohash';

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  plaintextPassword: z.string().min(6),
  // turnstile: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );

  if (!result.success) throw createError('somethin fucked up');

  const {email, plaintextPassword} = result.data;

  const selectedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selectedUser) {
    throw createError('Nesprávny email alebo heslo');
  }

  const hashedPassword = sha256(plaintextPassword + selectedUser.passwordSalt);

  const validatedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.hashedPassword, hashedPassword))
    .get();

  if (!validatedUser) {
    throw createError('Nesprávny email alebo heslo');
  } else if (!validatedUser.verifiedEmail) {
    throw createError({
      message: 'The email is not verified',
      statusCode: 403,
      statusMessage: 'Forbidden',
    });
  }

  await setUserSession(event, {
    user: validatedUser.email,
  });

  return 'Login succesfull';
});
