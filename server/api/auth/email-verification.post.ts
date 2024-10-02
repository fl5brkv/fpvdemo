import {sha256} from 'ohash';

const emailVerificationSchema = z.object({
  randomToken: z.string(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    emailVerificationSchema.safeParse(body)
  );

  if (!result.success) throw createError('Token is missing');

  const {randomToken} = result.data;

  const hashedToken = sha256(randomToken);

  const [verificationTokenJoin] = await useDrizzle()
    .select({
      verificationTokenId: tables.verificationTokens.verificationTokenId,
      verificationTokenUserId: tables.verificationTokens.userId,
      userVerifiedEmail: tables.users.verifiedEmail,
    })
    .from(tables.verificationTokens)
    .innerJoin(
      tables.users,
      eq(tables.users.userId, tables.verificationTokens.verificationTokenId)
    )
    .where(
      and(
        eq(tables.verificationTokens.hashedToken, hashedToken),
        gt(tables.verificationTokens.expiresAt, Date.now())
      )
    );

  if (!verificationTokenJoin) {
    throw createError('Invalid or expired token');
  } else if (verificationTokenJoin.userVerifiedEmail) {
    return {message: 'User already verified'};
  }

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

  // await useDrizzle()
  //   .update(tables.users)
  //   .set({verifiedEmail: true})
  //   .where(eq(tables.users.userId, verificationTokenJoin.verificationTokenUserId));

  // await useDrizzle()
  //   .delete(tables.verificationTokens)
  //   .where(eq(
  //        tables.verificationTokens.verificationTokenId,
  //       verificationTokenJoin.verificationTokenId
  //      ));

  return {message: 'User successfully verified'};
});

// OLD QUERY

// const verificationRecord =
//   await useDrizzle().query.verificationTokens.findFirst({
//     where: and(
//       eq(tables.verificationTokens.hashedToken, hashedToken),
//       gt(tables.verificationTokens.expiresAt, Date.now())
//     ),
//     with: {
//       user: {
//         columns: {
//           id: true,
//           verifiedEmail: true,
//         },
//       },
//     },
//   });
