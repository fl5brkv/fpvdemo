import {sha256} from 'ohash';

const validationSchema = z.object({
  randomToken: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'Token is missing',
    });

  const {randomToken} = result.data;

  const hashedToken = sha256(randomToken);

  const [verificationTokenJoin] = await useDrizzle()
    .select({
      verificationTokenId: tables.verificationTokens.verificationTokenId,
      verificationTokenUserId: tables.verificationTokens.userId,
    })
    .from(tables.verificationTokens)
    .innerJoin(
      tables.users,
      eq(tables.users.userId, tables.verificationTokens.userId)
    )
    .where(
      and(
        eq(tables.verificationTokens.hashedToken, hashedToken),
        gt(tables.verificationTokens.expiresAt, Date.now())
      )
    );

  if (!verificationTokenJoin)
    throw createError({
      statusMessage: 'Invalid or expired verification token.',
    });

  // this is maybe unnecessary
  // if (verificationTokenJoin.userVerifiedEmail)
  //   throw createError({
  //     statusMessage: 'User has already verified their email.',
  //   });

  // OPTION 1

  // await useDrizzle().transaction(async (tx) => {
  //   await tx
  //     .update(tables.users)
  //     .set({verifiedEmail: true})
  //     .where(
  //       eq(tables.users.userId, verificationTokenJoin.verificationTokenUserId)
  //     );

  //   await tx
  //     .delete(tables.verificationTokens)
  //     .where(
  //       eq(
  //         tables.verificationTokens.verificationTokenId,
  //         verificationTokenJoin.verificationTokenId
  //       )
  //     );
  // });

  // OPTION 2

  await useDrizzle()
    .update(tables.users)
    .set({verifiedEmail: true})
    .where(
      eq(tables.users.userId, verificationTokenJoin.verificationTokenUserId)
    );

  await useDrizzle()
    .delete(tables.verificationTokens)
    .where(
      eq(
        tables.verificationTokens.verificationTokenId,
        verificationTokenJoin.verificationTokenId
      )
    );

  return 'User successfully verified'
});
