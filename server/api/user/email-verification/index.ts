import {sha256} from 'ohash';
import {emailVerificationSchema} from '~/server/database/schemas/tables/users';

const validationSchema = emailVerificationSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) throw createError({statusMessage: 'Token is missing'});

  const {verificationLink} = result.data;

  const decodedString = atob(decodeURIComponent(verificationLink));

  const [email, receivedCode, expiresAt] = decodedString.split(':');

  if (Date.now() > Number(expiresAt))
    throw createError({
      statusMessage: 'Invalid or expired verification token.',
    });

  const selected = await useDrizzle()
    .select({
      userId: tables.users.userId,
      email: tables.users.email,
      verifiedEmail: tables.users.verifiedEmail,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected) throw createError({statusMessage: 'User not found'});

  if (selected.verifiedEmail)
    throw createError({statusMessage: 'Email already verified'});

  const fields = [selected.userId, selected.email];

  const config = useRuntimeConfig(event);

  if (
    receivedCode !==
    sha256(`${fields.join('')}${config.passwordSalt}${expiresAt}`)
  )
    throw createError({
      statusMessage: 'Invalid verification code',
    });

  await useDrizzle()
    .update(tables.users)
    .set({verifiedEmail: true})
    .where(eq(tables.users.email, email));

  return 'Email verified';
});
