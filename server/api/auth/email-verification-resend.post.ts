import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';

const validationSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selectedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selectedUser)
    throw createError({statusMessage: 'No user found with the provided email'});

  if (selectedUser.verifiedEmail)
    throw createError({statusMessage: 'Email already verified'});

  const randomToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(randomToken);

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: selectedUser.userId,
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
