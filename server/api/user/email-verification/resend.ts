import {render} from '@vue-email/render';
import EmailVerification from '~~/app/components/Email/EmailVerification.vue';
import {emailVerificationResendSchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';
import {WorkerMailer} from 'worker-mailer';

const validationSchema = emailVerificationResendSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusMessage: 'The provided data is invalid',
      data: {message: 'The provided data is invalid'},
    });

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

  if (!selected)
    throw createError({
      statusMessage: 'User not found',
      data: {message: 'User not found'},
    });

  if (selected.verifiedEmail)
    throw createError({
      statusMessage: 'Email already verified',
      data: {message: 'Email already verified'},
    });

  const fields = [selected.userId, selected.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const verificationCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  const html = await render(EmailVerification, {
    verificationLink: `${
      config.public.baseURL
    }/email-verification/${encodeURIComponent(
      btoa(`${selected.email}:${verificationCode}:${expiresAt}`)
    )}`,
  });

  const mailer = await WorkerMailer.connect({
    credentials: {
      username: config.mailerUsername,
      password: config.mailerPassword,
    },
    host: 'smtp.eu.mailgun.org',
    port: 587,
    secure: false,
    authType: 'plain',
  });

  await mailer.send({
    from: {email: 'info@fpvdemo.fun'},
    subject: 'Email verification request',
    to: {email},
    html,
  });

  return 'Please check your email to verify your account!';
});
