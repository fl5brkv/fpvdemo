import {sha256} from 'ohash';
import {randomBytes} from 'crypto';

const passwordRecoverySchema = z.object({
  randomToken: z.string(),
  plaintextPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordRecoverySchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
    });

  const {randomToken, plaintextPassword} = result.data;

  const hashedToken = sha256(randomToken);

  const [recoveryTokenJoin] = await useDrizzle()
    .select({
      recoveryTokenUserId: tables.recoveryTokens.userId,
    })
    .from(tables.recoveryTokens)
    .innerJoin(
      tables.users,
      eq(tables.users.userId, tables.recoveryTokens.recoveryTokenId)
    )
    .where(
      and(
        eq(tables.recoveryTokens.hashedToken, hashedToken),
        gt(tables.recoveryTokens.expiresAt, Date.now())
      )
    );

  if (!recoveryTokenJoin) {
    throw createError('Invalid or expired token');
  }

  const passwordSalt = randomBytes(16).toString('hex');

  const hashedPassword = sha256(plaintextPassword + passwordSalt);

  // AK POJDU TRANSAKCIE MOZEM ICH IMPLEMENTOVAT NAMIESTO TOHTO ⬇️⬇️

  await useDrizzle()
    .update(tables.users)
    .set({hashedPassword, passwordSalt})
    .where(eq(tables.users.userId, recoveryTokenJoin.recoveryTokenUserId));

  await useDrizzle()
    .delete(tables.recoveryTokens)
    .where(
      eq(tables.recoveryTokens.userId, recoveryTokenJoin.recoveryTokenUserId)
    );

  return {message: 'succesfull broooooo'};
});

// OLD

// const recoveryRecord = await useDrizzle().query.recoveryTokens.findFirst({
//   where: and(
//     eq(tables.recoveryTokens.hashedToken, hashedToken),
//     gt(tables.recoveryTokens.expiresAt, Date.now())
//   ),
//   with: {
//     user: {
//       columns: {
//         id: true,
//         verifiedEmail: true,
//       },
//     },
//   },
// });
