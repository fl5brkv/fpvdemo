import {render} from '@vue-email/render';
import EmailVerification from '@/components/Email/EmailVerification.vue';
import {signupSchema} from '~/server/database/schemas/tables/users';
import {nanoid} from 'nanoid';

const validationSchema = signupSchema;

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    validationSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({statusMessage: 'The provided data is invalid'});

  const {email, password} = result.data;

  const passwordSalt = nanoid();

  const hashedPassword = await hashPassword(password + passwordSalt);

  const inserted = await useDrizzle()
    .insert(tables.users)
    .values({
      email,
      password: hashedPassword,
      passwordSalt,
    })
    .onConflictDoNothing()
    .returning({id: tables.users.userId})
    .get();

  if (!inserted)
    throw createError({
      statusMessage: 'The email is invalid or already taken',
    });

  const randomToken = nanoid();

  const hashedToken = await hashPassword(randomToken);

  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

  await useDrizzle().insert(tables.verificationTokens).values({
    userId: inserted.id,
    hashedToken,
    expiresAt,
  });

  const {sendMail} = useNodeMailer();

  const html = await render(EmailVerification, {
    verifyLink: `localhost:3000/email-verification/${encodeURIComponent(
      randomToken
    )}`,
  });

  await sendMail({subject: 'neviem', to: email, html});

  return 'Register succesfull';
});
