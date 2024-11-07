import {passwordRecoveryRandomTokenSchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = passwordRecoveryRandomTokenSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {password, randomToken} = result.data;

  const hashedToken = await hashPassword(randomToken);

  const selected = await useDrizzle()
    .select({
      recoveryTokenUserId: tables.recoveryTokens.userId,
    })
    .from(tables.recoveryTokens)
    .where(
      and(
        eq(tables.recoveryTokens.hashedToken, hashedToken),
        gt(tables.recoveryTokens.expiresAt, Date.now())
      )
    )
    .get();

  if (!selected) throw createError({statusMessage: 'Invalid or expired token'});

  const passwordSalt = nanoid();

  const hashedPassword = await hashPassword(password + passwordSalt);

  await useDrizzle()
    .update(tables.users)
    .set({password: hashedPassword, passwordSalt})
    .where(eq(tables.users.userId, selected.recoveryTokenUserId));

  await useDrizzle()
    .delete(tables.recoveryTokens)
    .where(eq(tables.recoveryTokens.userId, selected.recoveryTokenUserId));

  return sendRedirect(event, '/login');
});
