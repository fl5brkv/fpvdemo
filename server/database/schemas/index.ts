import {batteries} from './tables/batteries';
import {droneComponents} from './tables/droneComponents';
import {drones} from './tables/drones';
import {flightSessions} from './tables/flightSessions';
import {fpvDrones} from './tables/fpvDrones';
import {items} from './tables/items';
import {itemsToFlightSessions} from './tables/itemsToFlightSessions';
import {profiles} from './tables/profiles';
import {recoveryTokens} from './tables/recoveryTokens';
import {users} from './tables/users';
import {verificationTokens} from './tables/verificationTokens';

export const schema = {
  users,
  verificationTokens,
  recoveryTokens,
  profiles,
  flightSessions,
  items,
  itemsToFlightSessions,
  drones,
  fpvDrones,
  droneComponents,
  batteries,
};
