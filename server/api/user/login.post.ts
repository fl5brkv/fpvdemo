import {loginSchema} from '~/server/database/schemas/tables/users';

const validationSchema = loginSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email, password} = result.data;

  const selected = await useDrizzle()
    .select({
      email: tables.users.email,
      password: tables.users.password,
      passwordSalt: tables.users.passwordSalt,
      verifiedEmail: tables.users.verifiedEmail,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected)
    throw createError({
      statusMessage: 'Incorrect email or password.',
    });

  const hashedPassword = await hashPassword(password + selected.passwordSalt);

  if (!(await verifyPassword(hashedPassword, selected.password)))
    throw createError({
      statusMessage: 'Incorrect email or password.',
    });

  if (!selected.verifiedEmail)
    throw createError({
      statusMessage: 'Email not verified.',
    });

  await replaceUserSession(event, {
    user: {
      email: selected.email,
    },
  });

  return 'Login succesfull';
});
