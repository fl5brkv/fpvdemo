import {loginSchema} from '~~/server/database/schema/tables/users';

const validationSchema = loginSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {email, password} = result.data;

  const selected = await useDrizzle()
    .select({
      userId: tables.users.userId,
      email: tables.users.email,
      password: tables.users.password,
      verifiedEmail: tables.users.verifiedEmail,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected || !(await verifyPassword(selected.password, password)))
    throw createError({
      statusMessage: 'Incorrect email or password.',
      data: {message: 'Incorrect email or password.'},
    });

  await replaceUserSession(event, {
    user: {
      userId: selected.userId,
      email: selected.email,
    },
  });

  return 'Login succesfull';
});
