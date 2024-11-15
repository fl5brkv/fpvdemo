import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {signupSchema} from '~/server/database/schemas/tables/users';
import {sha256} from 'ohash';

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

  const verificationCode = sha256(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verificationLink: `localhost:3000/email-verification/${encodeURIComponent(
      btoa(`${inserted.email}:${verificationCode}:${expiresAt}`)
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return 'Please check your email to verify your account!';
});
