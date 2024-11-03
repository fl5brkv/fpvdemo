import {nanoid} from 'nanoid';
import {passwordChangeSchema} from '~/server/database/schemas/tables/users';

const validationSchema = passwordChangeSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

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

  if (!selected)
    throw createError({
      statusMessage: 'Incorrect email or password.',
    });

  const hashedPassword = await hashPassword(password + selected.passwordSalt);

  if (!(await verifyPassword(hashedPassword, selected.password)))
    throw createError({
      statusMessage: 'Incorrect password.',
    });

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

  if (!updated) {
    throw createError('user nebol updatovany');
  }

  return 'Updates succesfully';
});
