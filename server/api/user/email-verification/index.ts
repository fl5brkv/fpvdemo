import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {emailVerificationSchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = emailVerificationSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selected = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected)
    throw createError({statusMessage: 'No user found with the provided email'});

  if (selected.verifiedEmail)
    throw createError({statusMessage: 'Email already verified'});

  const randomToken = nanoid();

  const hashedToken = await hashPassword(randomToken);

  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: selected.userId,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verifyLink: `localhost:3000/email-verification/${encodeURIComponent(
      randomToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return 'succesfull broooooo';
});
