import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  plaintextPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    registerSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {email, plaintextPassword} = result.data;

  const passwordSalt = randomBytes(16).toString('hex');
  const hashedPassword = sha256(plaintextPassword + passwordSalt);

  const insertedUser = await useDrizzle()
    .insert(tables.users)
    .values({
      email,
      hashedPassword,
      passwordSalt,
    })
    .onConflictDoNothing()
    .returning({id: tables.users.userId})
    .get();

  if (!insertedUser) {
    throw createError('user nebol insertovany');
  }

  const randomToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(randomToken);

  // 1 hour
  const expiresAt = Date.now() + 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: insertedUser.id,
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

  return {insertedUser};
});
