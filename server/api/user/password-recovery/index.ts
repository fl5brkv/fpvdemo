import {passwordRecoverySchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';

const validationSchema = passwordRecoverySchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

  const {password, recoveryLink} = result.data;

  const decodedString = atob(decodeURIComponent(recoveryLink));

  const [email, receivedCode, expiresAt] = decodedString.split(':');

  if (Date.now() > Number(expiresAt))
    throw createError({
      statusMessage: 'Invalid or expired verification token.',
      data: {message: 'Invalid or expired verification token.'},
    });

  const selected = await useDrizzle()
    .select({
      userId: tables.users.userId,
      email: tables.users.email,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected)
    throw createError({
      statusMessage: 'User not found',
      data: {message: 'User not found'},
    });

  const fields = [selected.userId, selected.email];

  const config = useRuntimeConfig(event);

  if (
    receivedCode !==
    digest(`${fields.join('')}${config.passwordSalt}${expiresAt}`)
  )
    throw createError({
      statusMessage: 'Invalid recovery code',
      data: {message: 'Invalid recovery code'},
    });

  const hashedPassword = await hashPassword(password);

  await useDrizzle()
    .update(tables.users)
    .set({password: hashedPassword})
    .where(eq(tables.users.email, email));

  return 'Password recovery succesfull';
});
