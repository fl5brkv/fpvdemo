import { randomBytes } from 'crypto';
import { sha256 } from 'ohash';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  turnstile: z.string()
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    registerSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const validatedResult = result.data;

  const verifyTurnstile = await verifyTurnstileToken(validatedResult.turnstile)

  if (!verifyTurnstile) {
    throw createError('turnstile not workin')
  }

  const lowercasedEmail = validatedResult.email.toLowerCase();
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = sha256(validatedResult.password + salt);

  const user = await useDrizzle().insert(tables.users).values({
    email: lowercasedEmail,
    password: hashedPassword,
    salt: salt,
    createdAt: new Date(),
  });

  return { user };
});
