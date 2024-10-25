import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import PasswordRecovery from '@/components/Email/PasswordRecovery.vue';

const validationSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email} = result.data;

  const selectedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selectedUser) throw createError({statusMessage: 'User not found'});

  const randomToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(randomToken);

  // 15 minutes
  const expiresAt = Date.now() + 15 * 60 * 1000;

  await useDrizzle().insert(tables.recoveryTokens).values({
    userId: selectedUser.userId,
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

  return {message: 'succesfull broooooo'};
});
