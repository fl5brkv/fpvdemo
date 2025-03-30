import {render} from '@vue-email/render';
import EmailVerification from '~~/app/components/Email/EmailVerification.vue';
import {emailChangeSchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';

const validationSchema = emailChangeSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const {user} = await requireUserSession(event);

  if (email === user.email)
    throw createError({
      statusMessage:
        'The email provided is already associated with your account.',
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

  if (!updated) throw createError({statusMessage: 'There was an error'});

  const fields = [updated.userId, updated.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const verificationCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  // const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verificationLink: `localhost:3000/email-verification/${encodeURIComponent(
      btoa(`${updated.email}:${verificationCode}:${expiresAt}`)
    )}`,
  });

  // await sendMail({subject: 'Email change request', to: email, html});

  return 'Your email has been succesfully updated! Please verify your new email address.';
});
