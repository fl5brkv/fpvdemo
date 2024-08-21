import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {render} from '@vue-email/render';
import AccountVerify from '@/components/Email/AccountVerify.vue';

const registerSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    registerSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {email, password} = result.data;

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = sha256(password + salt);

  const insertedUser = await useDrizzle()
    .insert(tables.users)
    .values({
      email,
      password: hashedPassword,
      salt,
    })
    .onConflictDoNothing()
    .returning({id: tables.users.id})
    .get();

  if (!insertedUser) {
    throw createError('user nebol insertovany');
  }

  const unhashedToken = randomBytes(32).toString('hex');

  const hashedToken = sha256(unhashedToken);

  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: insertedUser.id,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(AccountVerify, {
    verifyLink: `localhost:3000/verify-email/${encodeURIComponent(
      unhashedToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return {insertedUser};
});
