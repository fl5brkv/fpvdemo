import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {User} from '~/server/utils/drizzle';

const emailChangeSchema = z.object({
  email: z.string().email().toLowerCase(),
  newEmail: z.string().email().toLowerCase(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    emailChangeSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {email, newEmail} = result.data;

  const {user} = (await requireUserSession(event)) as {user: User};

  const updatedUser = await useDrizzle()
    .update(tables.users)
    .set({
      email: newEmail,
      verifiedEmail: false,
    })
    .where(eq(tables.users.userId, user.userId))
    .returning()
    .get();

  if (!updatedUser) {
    throw createError('user nebol najdeny, takze nebol updatovany');
  }

  const randomToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(randomToken);

  // 1 hour
  const expiresAt = Date.now() + 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: updatedUser.userId,
    hashedToken,
    expiresAt,
  });

  const html = await render(EmailVerification, {
    verifyLink: `localhost:3000/email-verification/${encodeURIComponent(
      randomToken
    )}`,
  });

  const {sendMail} = useNodeMailer();

  await sendMail({subject: 'neviem', to: email, html});

  return {updatedUser};
});
