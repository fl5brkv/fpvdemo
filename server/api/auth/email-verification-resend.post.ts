import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';

const verifyEmailResendSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    verifyEmailResendSchema.safeParse(body)
  );

  if (!result.success) throw createError('somethin fucked up');

  const {email} = result.data;

  const returnedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!returnedUser) {
    throw createError('Mail nebol najdeny');
  }

  const unhashedToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(unhashedToken);

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: returnedUser.id,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verifyLink: `localhost:3000/email-verification/${encodeURIComponent(
      unhashedToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return {message: 'succesfull broooooo'};
});
