import {sha256} from 'ohash';

const verifyEmailSchema = z.object({
  unhashedToken: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    verifyEmailSchema.safeParse(body)
  );

  if (!result.success) throw createError('Token is missing');

  const {unhashedToken} = result.data;

  const hashedToken = sha256(unhashedToken);

  const verificationRecord =
    await useDrizzle().query.verificationTokens.findFirst({
      where: and(
        eq(tables.verificationTokens.hashedToken, hashedToken),
        gt(tables.verificationTokens.expiresAt, Date.now())
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

  if (!verificationRecord || !verificationRecord.user) {
    throw createError('Invalid or expired token');
  }

  if (verificationRecord.user.verifiedEmail) {
    return {message: 'User already verified'};
  }

  // await useDrizzle().transaction(async (tx) => {
  //   await tx
  //     .update(tables.users)
  //     .set({verifiedEmail: true})
  //     .where(eq(tables.users.id, verificationRecord.user.id));

  //   await tx
  //     .delete(tables.verificationTokens)
  //     .where(eq(tables.verificationTokens.id, verificationRecord.id));
  // });

  await useDrizzle()
    .update(tables.users)
    .set({verifiedEmail: true})
    .where(eq(tables.users.id, verificationRecord.user.id));

  await useDrizzle()
    .delete(tables.verificationTokens)
    .where(eq(tables.verificationTokens.userId, verificationRecord.user.id));

  return {message: 'User successfully verified'};
});
