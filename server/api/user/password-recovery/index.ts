import {render} from '@vue-email/render';
import PasswordRecovery from '@/components/Email/PasswordRecovery.vue';
import {passwordRecoverySchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = passwordRecoverySchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selected = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected) throw createError({statusMessage: 'User not found'});

  const randomToken = nanoid();

  const hashedToken = await hashPassword(randomToken);

  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

  await useDrizzle().insert(tables.recoveryTokens).values({
    userId: selected.userId,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(PasswordRecovery, {
    recoveryLink: `localhost:3000/password-recovery/${encodeURIComponent(
      randomToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return 'Please check your email to recover your password!';
});
