import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {users} from '~/server/database/schema';

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
    .where(eq(tables.users.id, user.id))
    .returning({id: users.id})
    .get();

  if (!updatedUser) {
    throw createError('user nebol najdeny, takze nebol updatovany');
  }

  const unhashedToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(unhashedToken);

  // 1 hour
  const expiresAt = Date.now() + 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: updatedUser.id,
    hashedToken,
    expiresAt,
  });

  const html = await render(EmailVerification, {
    verifyLink: `localhost:3000/email-verification/${encodeURIComponent(
      unhashedToken
    )}`,
  });

  const {sendMail} = useNodeMailer();

  await sendMail({subject: 'neviem', to: email, html});

  return {updatedUser};
});
