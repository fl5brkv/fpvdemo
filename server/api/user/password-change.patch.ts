import {nanoid} from 'nanoid';
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
      passwordSalt: tables.users.passwordSalt,
    })
    .from(tables.users)
    .where(eq(tables.users.email, user.email))
    .get();

  if (
    !selected ||
    !(await verifyPassword(
      await hashPassword(password + selected.passwordSalt),
      selected.password
    ))
  ) {
    throw createError({statusMessage: 'Incorrect email or password.'});
  }

  const passwordSalt = nanoid();

  const hashedNewPassword = await hashPassword(newPassword + passwordSalt);

  const updated = await useDrizzle()
    .update(tables.users)
    .set({
      password: hashedNewPassword,
      passwordSalt,
    })
    .where(eq(tables.users.email, user.email))
    .returning()
    .get();

  if (!updated) throw createError('There was an error.');

  return 'Your password has been successfully updated!';
});
