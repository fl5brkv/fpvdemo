import { sha256 } from 'ohash';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // turnstile: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );

  if (!result.success) throw createError('somethin fucked up');

  const validatedResult = result.data;

  const lowercasedEmail = validatedResult.email.toLowerCase();

  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, lowercasedEmail))
    .get();

  if (!user) {
    throw createError('Nesprávny email alebo heslo');
  }

  const validatedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(
      eq(tables.users.password, sha256(validatedResult.password + user.salt))
    )
    .get();

  if (!validatedUser) {
    throw createError('Nesprávny email alebo heslo');
  }

  await setUserSession(event, {
    user: validatedUser.email,
  });
});
