import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {User} from '~/server/utils/drizzle';

const passwordChangeSchema = z.object({
  plaintextPassword: z.string().min(6),
  newPlaintextPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordChangeSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {plaintextPassword, newPlaintextPassword} = result.data;

  const {user} = (await requireUserSession(event)) as {user: User};

  const hashedPassword = sha256(plaintextPassword + user.passwordSalt);

  const passwordSalt = randomBytes(16).toString('hex');

  const newHashedPassword = sha256(newPlaintextPassword + passwordSalt);

  const updatedUser = await useDrizzle()
    .update(tables.users)
    .set({
      hashedPassword: newHashedPassword,
      passwordSalt,
    })
    .where(
      and(
        eq(tables.users.userId, user.userId),
        eq(tables.users.hashedPassword, hashedPassword)
      )
    )
    .returning()
    .get();

  if (!updatedUser) {
    throw createError('user nebol najdeny, takze nebol updatovany');
  }

  return {updatedUser};
});
