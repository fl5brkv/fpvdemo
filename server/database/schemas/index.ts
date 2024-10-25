import {flightSessions} from './tables/flightSessions';
import {items} from './tables/items';
import {itemsToFlightSessions} from './tables/itemsToFlightSessions';
import {profiles} from './tables/profiles';
import {recoveryTokens} from './tables/recoveryTokens';
import {users} from './tables/users';
import {verificationTokens} from './tables/verificationTokens';

export const schema = {
  users,
  profiles,
  verificationTokens,
  recoveryTokens,
  flightSessions,
  items,
  itemsToFlightSessions,
};
