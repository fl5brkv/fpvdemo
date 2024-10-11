import {sha256} from 'ohash';

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  plaintextPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email, plaintextPassword} = result.data;

  const selectedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selectedUser) {
    throw createError({
      statusCode: 401,
      message: 'Incorrect email or password',
    });
  }
  const hashedPassword = sha256(plaintextPassword + selectedUser.passwordSalt);

  const validatedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.hashedPassword, hashedPassword))
    .get();

  if (!validatedUser) {
    throw createError({
      statusCode: 401,
      message: 'Incorrect email or password',
    });
  }

  if (!validatedUser.verifiedEmail) {
    throw createError({
      statusCode: 403,
      message: 'Email not verified',
    });
  }
  await setUserSession(event, {
    user: validatedUser.email,
  });

  return 'Login succesfull';
});
