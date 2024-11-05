import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {emailChangeSchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = emailChangeSchema;

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

  // toto tu nebude nebudem logoutovat usera aby sa nevymkli z uctu, 
  // staci ked vytvorim middleware, ktory checkne ci je email verified
  await clearUserSession(event);

  return 'Your email has been succesfully updated! Please verify your new email address.';
});
