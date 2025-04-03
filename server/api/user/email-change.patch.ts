import {render} from '@vue-email/render';
import EmailVerification from '~~/app/components/Email/EmailVerification.vue';
import {emailChangeSchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';
import {WorkerMailer} from 'worker-mailer';

const validationSchema = emailChangeSchema;

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

  const {user} = await requireUserSession(event);

  if (email === user.email)
    throw createError({
      statusMessage:
        'The email provided is already associated with your account.',
      data: {
        message: 'The email provided is already associated with your account.',
      },
    });

  const updated = await useDrizzle()
    .update(tables.users)
    .set({
      email,
      verifiedEmail: false,
    })
    .where(eq(tables.users.email, user.email))
    .returning({userId: tables.users.userId, email: tables.users.email})
    .get();

  if (!updated)
    throw createError({
      statusMessage: 'There was an error',
      data: {message: 'There was an error'},
    });

  const fields = [updated.userId, updated.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const verificationCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  const html = await render(EmailVerification, {
    verificationLink: `${
      config.public.baseURL
    }/email-verification/${encodeURIComponent(
      btoa(`${updated.email}:${verificationCode}:${expiresAt}`)
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
    subject: 'Email change request',
    to: {email},
    html,
  });

  return 'Your email has been succesfully updated! Please verify your new email address.';
});
