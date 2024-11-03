import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {emailChangeUserSchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = emailChangeUserSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {email} = result.data;

  const {user} = await requireUserSession(event);

  const updated = await useDrizzle()
    .update(tables.users)
    .set({
      email,
      verifiedEmail: false,
    })
    .where(eq(tables.users.email, user.email))
    .returning()
    .get();

  if (!updated) throw createError('user nebol najdeny, takze nebol updatovany');

  const randomToken = nanoid();

  const hashedToken = await hashPassword(randomToken);

  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: updated.userId,
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

  await clearUserSession(event);

  return 'succesfull';
});
