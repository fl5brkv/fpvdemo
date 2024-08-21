import {sha256} from 'ohash';

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
  // turnstile: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );

  if (!result.success) throw createError('somethin fucked up');

  const {email, password} = result.data;

  const user = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!user) {
    throw createError('Nesprávny email alebo heslo');
  }

  const validatedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.password, sha256(password + user.salt)))
    .get();

  if (!validatedUser) {
    throw createError('Nesprávny email alebo heslo');
  }

  await setUserSession(event, {
    user: validatedUser.email,
  });

  return 'Login succesfull';
});
