import {randomBytes} from 'crypto';
import {sha256} from 'ohash';
import {users} from '~/server/database/schema';

const passwordChangeSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6),
});

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    passwordChangeSchema.safeParse(body)
  );

  if (!result.success) throw createError('errorin');

  const {password, newPassword} = result.data;

  const salt = randomBytes(16).toString('hex');

  const newHashedPassword = sha256(newPassword + salt);

  const {user} = (await requireUserSession(event)) as {user: User};

  const loggedInUser = await useDrizzle()
    .select()
    .from(tables.users)
    .where(eq(tables.users.id, user.id))
    .get();

  if (!loggedInUser) {
    throw createError('User nebol najdeny');
  }

  const hashedPassword = sha256(password + loggedInUser.salt);

  const updatedUser = await useDrizzle()
    .update(tables.users)
    .set({
      password: newHashedPassword,
      salt,
    })
    .where(
      and(
        eq(tables.users.id, user.id),
        eq(tables.users.password, hashedPassword)
      )
    )
    .returning({id: users.id})
    .get();

  if (!updatedUser) {
    throw createError('user nebol najdeny, takze nebol updatovany');
  }

  return {updatedUser};
});
