import {render} from '@vue-email/render';
import EmailVerification from '~~/app/components/Email/EmailVerification.vue';
import {signupSchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';
import {WorkerMailer} from 'worker-mailer';

const validationSchema = signupSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email, password} = result.data;

  const hashedPassword = await hashPassword(password);

  const inserted = await useDrizzle()
    .insert(tables.users)
    .values({
      email,
      password: hashedPassword,
    })
    .onConflictDoNothing()
    .returning({userId: tables.users.userId, email: tables.users.email})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'The email is invalid or already taken',
    });

  const fields = [inserted.userId, inserted.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const verificationCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  const html = await render(EmailVerification, {
    verificationLink: `${config.public.baseURL}/email-verification/${encodeURIComponent(
      btoa(`${inserted.email}:${verificationCode}:${expiresAt}`)
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
