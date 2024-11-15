import {passwordChangeSchema} from '~/server/database/schemas/tables/users';

const validationSchema = passwordChangeSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {password, newPassword} = result.data;

  const {user} = await requireUserSession(event);

  const selected = await useDrizzle()
    .select({
      password: tables.users.password,
    })
    .from(tables.users)
    .where(eq(tables.users.email, user.email))
    .get();

  if (!selected || !(await verifyPassword(selected.password, password))) {
    throw createError({statusMessage: 'Incorrect email or password.'});
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const updated = await useDrizzle()
    .update(tables.users)
    .set({
      password: hashedNewPassword,
    })
    .where(eq(tables.users.email, user.email));

  return 'Your password has been successfully updated!';
});
