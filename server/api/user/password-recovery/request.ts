import {render} from '@vue-email/render';
import PasswordRecovery from '~~/app/components/Email/PasswordRecovery.vue';
import {passwordRecoveryRequestSchema} from '~~/server/database/schema/tables/users';
import {digest} from 'ohash';

const validationSchema = passwordRecoveryRequestSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selected = await useDrizzle()
    .select({userId: tables.users.userId, email: tables.users.email})
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected) throw createError({statusMessage: 'User not found'});

  const fields = [selected.userId, selected.email];

  const expiresAt = Date.now() + 60 * 60 * 1000;

  const config = useRuntimeConfig(event);

  const recoveryCode = digest(
    `${fields.join('')}${config.passwordSalt}${expiresAt}`
  );

  const {sendMail} = useNodeMailer();

  const html = await render(PasswordRecovery, {
    recoveryLink: `localhost:3000/password-recovery/${encodeURIComponent(
      btoa(`${selected.email}:${recoveryCode}:${expiresAt}`)
    )}`,
  });

  await sendMail({subject: 'Password recovery request', to: email, html});

  return 'Please check your email to recover your password!';
});
