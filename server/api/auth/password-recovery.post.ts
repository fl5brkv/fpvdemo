import {sha256} from 'ohash';
import {randomBytes} from 'crypto';

const passwordRecoverySchema = z.object({
  unhashedToken: z.string(),
  password: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordRecoverySchema.safeParse(body)
  );

  if (!result.success) throw createError('Token is missing');

  const {unhashedToken, password} = result.data;

  const hashedToken = sha256(unhashedToken);

  const recoveryRecord = await useDrizzle().query.recoveryTokens.findFirst({
    where: and(
      eq(tables.recoveryTokens.hashedToken, hashedToken),
      gt(tables.recoveryTokens.expiresAt, Date.now())
    ),
    with: {
      user: {
        columns: {
          id: true,
          verifiedEmail: true,
        },
      },
    },
  });

  if (!recoveryRecord || !recoveryRecord.user) {
    throw createError('Invalid or expired token');
  }

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = sha256(password + salt);

  await useDrizzle()
    .update(tables.users)
    .set({password: hashedPassword, salt})
    .where(eq(tables.users.id, recoveryRecord.user.id));

  await useDrizzle()
    .delete(tables.recoveryTokens)
    .where(eq(tables.recoveryTokens.userId, recoveryRecord.user.id));

  return {message: 'succesfull broooooo'};
});
