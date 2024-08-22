import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import PasswordRecovery from '@/components/Email/PasswordRecovery.vue';

const passwordRecoveryRequestSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordRecoveryRequestSchema.safeParse(body)
  );

  if (!result.success) throw createError('somethin fucked up');

  const {email} = result.data;

  const returnedUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!returnedUser) {
    throw createError('Mail nebol najdeny');
  }

  const unhashedToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(unhashedToken);

  // 15 minutes
  const expiresAt = Date.now() + 15 * 60 * 1000;

  await useDrizzle().insert(tables.recoveryTokens).values({
    userId: returnedUser.id,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(PasswordRecovery, {
    recoveryLink: `localhost:3000/password-recovery/${encodeURIComponent(
      unhashedToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return {message: 'succesfull broooooo'};
});
