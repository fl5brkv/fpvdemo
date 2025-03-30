import {render} from '@vue-email/render';
import EmailVerification from '~~/app/components/Email/EmailVerification.vue';
import {emailVerificationResendSchema} from  '~~/server/database/schema/tables/users';
import {digest} from 'ohash';

const validationSchema = emailVerificationResendSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selected = await useDrizzle()
    .select({
      userId: tables.users.userId,
      email: tables.users.email,
      verifiedEmail: tables.users.verifiedEmail,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected) throw createError({statusMessage: 'User not found'});

  if (selected.verifiedEmail)
    throw createError({statusMessage: 'Email already verified'});

  const fields = [selected.userId, selected.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const verificationCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  // const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verificationLink: `localhost:3000/email-verification/${encodeURIComponent(
      btoa(`${selected.email}:${verificationCode}:${expiresAt}`)
    )}`,
  });

  // await sendMail({subject: 'Email verification', to: email, html});

  return 'Please check your email to verify your account!';
});
