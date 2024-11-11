import {flights} from './tables/flights';
import {items} from './tables/items';
import {recoveryTokens} from './tables/recoveryTokens';
import {users} from './tables/users';
import {verificationTokens} from './tables/verificationTokens';

export const schema = {
  users,
  verificationTokens,
  recoveryTokens,
  flights,
  items,
};
