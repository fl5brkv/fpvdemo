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

  const hashedToken = await hashPassword(randomToken);

  const selected = await useDrizzle()
    .select()
    .from(tables.verificationTokens)
    .where(
      and(
        eq(tables.verificationTokens.hashedToken, hashedToken),
        gt(tables.verificationTokens.expiresAt, Date.now())
      )
    )
    .get();

  if (!selected)
    throw createError({
      statusMessage: 'Invalid or expired verification token.',
    });

  await useDrizzle()
    .update(tables.users)
    .set({verifiedEmail: true})
    .where(eq(tables.users.userId, selected.userId));

  await useDrizzle()
    .delete(tables.verificationTokens)
    .where(
      eq(
        tables.verificationTokens.verificationTokenId,
        selected.verificationTokenId
      )
    );

  return 'User successfully verified';
});
